import React, { Component } from 'react';
import '../signup.css';
import google from '../static/images/google.svg';
import logo_black from '../static/images/logos/super-logo-black.png';
import axios from 'axios';
import spinner from '../static/images/spinner.svg'
import spinner_black from '../static/images/spinner_black.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import SignupBase from './SignupBase'
import {set_user_details } from "../actions/actions.js";
import { API_URL } from '../index.js';

class ResetPasswordConfirmation extends Component {
  // a page where the user can reset their password

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      reset_complete: false,
      password: "",
      password_error: false,
      uid: window.location.pathname.split('/')[2],
      token: window.location.pathname.split('/')[3]
    }
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onResetSubmit = this.onResetSubmit.bind(this);
  }

  onResetSubmit(e) {
    e.preventDefault()
    if (this.state.password.length < 6) {
      this.setState({password_error: true})
      return
    }
    if (this.state.submitting) {
      return
    } else {
      this.setState({submitting: true})
    }

    const data = {
      new_password: this.state.password,
      re_new_password: this.state.password,
      uid: this.state.uid,
      token: this.state.token
    }
    // sending the POST request to the signup endpoint
    axios.post(`${API_URL}/api/auth/password/reset/confirm/`, data)
      .then(res => {
        console.log(res)
        this.setState({reset_complete: true, submitting: false})
        this.props.set_user_details(res.data)

        // if there is no error, we redirect after 3 seconds
        setTimeout(() => {
          this.setState({redirect_to_app: true})
        }, 3000);
      })
      .catch(err => {
        this.setState({submitting: false})
        console.log(err)
        toast.error("Invalid password reset URL. Please request a new one.");
      });
  }

  onPasswordChange(e) {
    this.setState({password: e.target.value})
    if (this.state.password_error) {
      this.setState({password_error: e.target.value.length < 6})
    }
  }
  render() {

    if (this.state.redirect_to_app) {
      return <Redirect to="/login" />
    }

    let RightCol = null;
    if (!this.state.reset_complete) {
      RightCol = (
        <div className="signup-right-col">
        <h2 className="margin-top-20">Reset Password</h2>
        <form onSubmit={this.onResetSubmit} >
        <p className="signup-label">New password</p>
        <input
        type="password"
        placeholder="New password"
        className="input"
        value={this.state.password}
        onChange={this.onPasswordChange}
        />
        {this.state.password_error ? <p className="signup-label-error">Password must be at least 6 characters long.</p> : null }

        <div className="flex">
          <button className="generic-button signin-button">
            {this.state.submitting ? <img className="submit-btn-spinner" src={spinner} alt="" /> : "Reset Password"}
          </button>
          <p className="signup-disclaimer">
          By using Super, you agree to our <Link to="/privacy">privacy policy</Link> and <Link to="/terms">terms</Link>.
          </p>
        </div>
        </form>

        <div className="signup-bottom-text">
        <p><Link to="/login">Back to sign in</Link>
          <br/>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>

        </div>
      )
    } else {
      RightCol = (
        <div className="signup-right-col">
        <h2 className="margin-top-20">Reset Successful</h2>
        <p className="margin-top-40">Your password has successfully been reset. <br/> Redirecting you now...</p>

        <div className="signup-bottom-text">
        <p><Link to="/login">Back to sign in</Link>
          <br/>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
        </div>
      )
    }
    return (
      <SignupBase
      RightCol={RightCol}
      />
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    set_user_details,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(ResetPasswordConfirmation);

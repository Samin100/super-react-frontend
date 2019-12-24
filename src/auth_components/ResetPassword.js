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



class ResetPassword extends Component {
  // a page where the user can reset their password

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      email_sent: false,
      email: ""
    }
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onResetSubmit = this.onResetSubmit.bind(this);
  }

  onResetSubmit(e) {
    e.preventDefault()

    console.log(e)
    // we ignore empty email fields
    if (this.state.email.trim() === "") {
      console.log("no email")
      return
    }
    if (this.state.submitting) {
      return
    } else {
      this.setState({submitting: true})
    }

    const data = {email: this.state.email}
    console.log(data)
    // sending the POST request to the signup endpoint
    axios.post('http://localhost:8000/api/auth/password/reset/', data)
      .then(res => {
        this.setState({email_sent: true})
      })
      .catch(err => {
        this.setState({submitting: false})
        toast.error("An error has occurred.");
      });
  }

  onEmailChange(e) {
    this.setState({email: e.target.value})
  }

  render() {
    let RightCol = null;
    if (!this.state.email_sent) {
      RightCol = (
        <div className="signup-right-col">
        <h2 className="margin-top-20">Reset Password</h2>
        <form onSubmit={this.onResetSubmit} >
        <p className="signup-label">Email</p>
        <input
        type="email"
        placeholder="Email"
        className="input"
        value={this.state.email}
        onChange={this.onEmailChange}
        />

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
        <h2 className="margin-top-20">Reset email sent</h2>
        <p className="margin-top-40">A password reset email has been sent to <br/><strong>{this.state.email}</strong>.</p>

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


export default ResetPassword;

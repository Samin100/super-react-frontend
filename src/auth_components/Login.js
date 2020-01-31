import React, { Component } from 'react';
import '../index.css';
import google from '../static/images/google.svg';
import logo_black from '../static/images/logos/super-logo-black.png';
import axios from 'axios';
import spinner from '../static/images/spinner.svg'
import spinner_black from '../static/images/spinner_black.svg'
import { ToastContainer, toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import SignupBase from './SignupBase'
import { set_user_details } from "../actions/actions.js";
import '../signup.css';
import { API_URL } from '../index.js';




class Login extends Component {


  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      submitting_google: false,
      email: "",
      password: "",
      redirect_to_app: props.user.logged_in
    }

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onGoogleClick = this.onGoogleClick.bind(this);

  }

  onEmailChange(e) {
    this.setState({ email: e.target.value })
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  onGoogleClick(e) {
    this.setState({ submitting_google: true })
  }

  onLoginSubmit(e) {
    e.preventDefault()

    if (this.state.email.trim() === "" || this.state.password === "") {
      return
    }

    if (this.state.submitting) {
      return
    } else {
      this.setState({ submitting: true })
    }

    // make POST request to API to login
    const data = {
      email: this.state.email,
      password: this.state.password
    }
    // sending the POST request to the signup endpoint
    axios.post(`${API_URL}/api/auth/login/`, data)
      .then(res => {
        // if there was an error, we display it in a notification
        if (res.data && res.data.error) {
          toast.error(res.data.error);
          this.setState({ submitting: false })
        } else {
          // if there is no error, we redirect
          this.props.set_user_details(res.data)
          this.setState({ redirect_to_app: true })
        }
      })
      .catch(err => {
        this.setState({ submitting: false })
      });
  }

  componentDidMount() {
    const on_google_success = googleUser => {
      axios.post(`${API_URL}/api/auth/google-signin/`, googleUser)
        .then(response => {
          // when we get a response, we pass it to set_user_details()
          this.props.set_user_details(response.data)
          this.setState({ redirect_to_app: true })
        })
        .catch(error => {
          console.log(error)
        });
    }
    const on_google_error = err => {
      console.log(err)
      this.setState({ submitting_google: false })
    }

    const googleLoadTimer = setInterval(() => {
      if (window.gapi) {
        // if the Google script has loaded
        // we can get the Auth instance and bind it to the Google button
        let auth2 = window.gapi.auth2.getAuthInstance()

        // adding the auth2 handler to the Google button
        auth2.attachClickHandler(document.getElementById('signin-with-google-button'), {}, on_google_success, on_google_error)

        // we remove the interval after we've bound the event handler to the button
        clearInterval(googleLoadTimer);
      }
    }, 90); // checking if the script loaded every 90 ms
  }

  render() {

    if (this.state.redirect_to_app) {
      return <Redirect to="/" />
    }

    const RightCol = (
      <div className="signup-right-col">
        <h2 className="margin-top-20">Welcome back!</h2>

        <button
          id="signin-with-google-button"
          onClick={this.onGoogleClick}
          className="google-login-button">
          {this.state.submitting_google ? <img className="submit-btn-spinner spinner-google" src={spinner_black} alt="" />
            :
            <span>
              <img src={google} className="logo" alt="" />
              Sign in with Google
      </span>
          }
        </button>
        <hr className="hr-text" data-content="OR" />

        <form onSubmit={this.onLoginSubmit} >
          <p className="signup-label">Email</p>
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={this.state.email}
            onChange={this.onEmailChange}
          />

          <p className="signup-label">Password</p>
          <input
            autoComplete="current-password"
            type="password"
            placeholder="Password"
            className="input"
            value={this.state.password}
            onChange={this.onPasswordChange}
          />

          <div className="flex">
            <button className="generic-button signin-button">
              {this.state.submitting ? <img className="submit-btn-spinner" src={spinner} alt="" /> : "Login"}
            </button>

            <p className="signup-disclaimer">
              By using Super, you agree to our <Link to="/privacy">privacy policy</Link> and <Link to="/terms">terms</Link>.
        </p>
          </div>
        </form>

        <div className="signup-bottom-text">
          <p><Link to="/reset-password">Forgot password?</Link>
            <br />Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>

      </div>
    )
    return (
      <SignupBase
        RightCol={RightCol}
      />
    )
  }
}

// this function maps the redux state to props this component can access
const mapStateToProps = state => {
  return {
    user: state.user
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    set_user_details,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

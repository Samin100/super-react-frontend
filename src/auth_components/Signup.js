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
import { set_user_details } from "../actions/actions.js";
import { API_URL } from '../index.js';



class Signup extends Component {
  // the page where new users can sign up
  // the two possible ways to sign up is via Google or via email
  constructor(props) {
    super(props);

    this.state = {
      show_fields: false,
      submitting: false,
      submitting_google: false,
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      first_name_error: false,
      last_name_error: false,
      email_error: false,
      password_error: false,
      redirect_to_app: props.user.logged_in
    }
    this.toggleFields = this.toggleFields.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
    this.onGoogleClick = this.onGoogleClick.bind(this);
  }

  onGoogleClick(e) {
    this.setState({ submitting_google: true })
  }

  onFirstNameChange(e) {
    this.setState({ first_name: e.target.value })
    if (this.state.first_name_error) {
      this.setState({ first_name_error: e.target.value.replace(/^\s+|\s+$/g, '').length === 0 })
    }
  }
  onLastNameChange(e) {
    this.setState({ last_name: e.target.value })
    if (this.state.last_name_error) {
      this.setState({ last_name_error: e.target.value.replace(/^\s+|\s+$/g, '').length === 0 })
    }
  }
  onEmailChange(e) {
    this.setState({ email: e.target.value })
    if (this.state.email_error) {
      this.setState({ email_error: !/\S+@\S+\.\S+/.test(e.target.value) })
    }
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value })
    if (this.state.password_error) {
      this.setState({ password_error: e.target.value.length < 6 })
    }
  }
  onSignupSubmit(e) {
    e.preventDefault()

    // checking if the name is valid
    this.setState({ first_name_error: this.state.first_name.replace(/^\s+|\s+$/g, '').length === 0 })
    this.setState({ last_name_error: this.state.last_name.replace(/^\s+|\s+$/g, '').length === 0 })
    this.setState({ email_error: !/\S+@\S+\.\S+/.test(this.state.email) })
    this.setState({ password_error: this.state.password.length < 6 })

    // validating fields before proceeding
    if (this.state.submitting ||
      this.state.first_name.replace(/^\s+|\s+$/g, '').length === 0 ||
      this.state.last_name.replace(/^\s+|\s+$/g, '').length === 0 ||
      !/\S+@\S+\.\S+/.test(this.state.email) ||
      this.state.password.length < 6) {
      return
    } else {
      this.setState({ submitting: true })
    }

    const data = {
      email: this.state.email,
      password: this.state.password,
      first_name: this.state.first_name,
      last_name: this.state.last_name
    }

    // sending the POST request to the signup endpoint
    axios.post(`${API_URL}/api/auth/signup/`, data)
      .then(res => {
        // if there was an error, we display it in a notification
        if (res.data && res.data.error) {
          toast.error(res.data.error);
          this.setState({ submitting: false, redirect_to_app: true })
        } else {
          // if there is no error, we redirect the user to the app
          this.props.set_user_details(res.data)
          this.setState({ redirect_to_app: true })
        }
      })
      .catch(err => {
        this.setState({ submitting: false })
      });
  }


  componentDidMount() {
    const googleLoadTimer = setInterval(() => {
      if (window.gapi) {
        // if the Google script has loaded
        // we can get the Auth instance and bind it to the Google button
        let auth2 = window.gapi.auth2.getAuthInstance()

        // signing the user out
        if (auth2.currentUser.get() && auth2.currentUser.get().isSignedIn()) {
          auth2.signOut(() => {
            console.log('signed out')
          })
        }


        // adding the auth2 handler to the Google button
        auth2.attachClickHandler(document.getElementById('signin-with-google-button'), {},
          googleUser => {
            console.log(googleUser)
            axios.post(`${API_URL}/api/auth/google-signin/`, googleUser)
              .then(res => {
                this.props.set_user_details(res.data)
                this.setState({ redirect_to_app: true })
              })
              .catch(err => {
                console.log(err);
              });
          },
          err => {
            console.log(err)
            this.setState({ submitting_google: false })
          });
        // we remove the interval after we've bound the event handler to the button
        clearInterval(googleLoadTimer);
      }
    }, 90); // checking if the script loaded every 90 ms

  }


  toggleFields(e) {
    this.setState({ show_fields: !this.state.show_fields })
  }

  render() {
    if (this.state.redirect_to_app) {
      return <Redirect to="/" />
    }

    let Fields;
    if (this.state.show_fields) {
      Fields = (
        <div>
          <form onSubmit={this.onSignupSubmit}>
            <p className="signup-label">First name</p>
            <input
              maxLength="128"
              type="text"
              placeholder="First name"
              className="input"
              value={this.state.first_name}
              onChange={this.onFirstNameChange}
            />
            {this.state.first_name_error ? <p className="signup-label-error">Please enter a first name.</p> : null}

            <p className="signup-label">Last name</p>
            <input
              maxLength="128"
              type="text"
              placeholder="Last name"
              className="input"
              value={this.state.last_name}
              onChange={this.onLastNameChange}
            />
            {this.state.last_name_error ? <p className="signup-label-error">Please enter a last name.</p> : null}

            <p className="signup-label">Email</p>
            <input
              maxLength="254"
              type="email"
              placeholder="Email"
              className="input"
              value={this.state.email}
              onChange={this.onEmailChange}
            />
            {this.state.email_error ? <p className="signup-label-error">Please enter a valid email.</p> : null}

            <p className="signup-label">Password</p>
            <input
              maxLength="128"
              type="password"
              placeholder="Password"
              className="input"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
            {this.state.password_error ? <p className="signup-label-error">Password must be at least 6 characters long.</p> : null}

            <div className="flex">
              <button type="submit" className="generic-button signin-button">
                {this.state.submitting ? <img className="submit-btn-spinner" src={spinner} alt="" /> : "Sign Up"}
              </button>
              <p className="signup-disclaimer">
                By using Super, you agree to our <Link to="/privacy">privacy policy</Link> and <Link to="/terms">terms</Link>.
          </p>
            </div>
          </form>
        </div>
      )
    } else {
      Fields = (
        <p
          onClick={this.toggleFields}
          className="signup-with-email-text">Sign up with email</p>
      )
    }

    const RightCol = (
      <div className="signup-right-col">
        <h2 className="margin-top-20">Create an account</h2>
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
        {Fields}
        <div className="signup-bottom-text">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

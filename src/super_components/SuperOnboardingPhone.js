import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { delete_app_notification, receive_items, set_items_list, set_user_details } from '../actions/actions.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import logo from '../static/images/logos/super-logo-black.png'
import { API_URL } from '../index.js';


class SuperOnboardingPhone extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hidden: false,
      phone_number: "",
      sending_message: false,
      message_sent: false,
      secret_message: "",
      invalid_number: false,
      error_sending_message: false,
      submitting_code: false,
      code_valid: false,
      invalid_code: false,

    }

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this)
    this.onPhoneSubmit = this.onPhoneSubmit.bind(this)
    this.onSecretMessageChange = this.onSecretMessageChange.bind(this)
    this.onSecretMessageSubmit = this.onSecretMessageSubmit.bind(this)

  }

  onSecretMessageSubmit(e) {
    // when the secret phone number code is submitted
    e.preventDefault()

    if (this.state.submitting_code || this.state.code_valid) {
      return
    }
    this.setState({ error_submitting_code: false, invalid_code: false, submitting_code: true })

    // getting the code
    const data = { code: this.state.secret_message }

    axios.post(`${API_URL}/api/phone/validate-code/`, data).then(res => {
      if (res.data.status === 'success') {
        // if the message was sent successfully
        this.setState({
          submitting_code: false,
          code_valid: true,
          invalid_code: false
        })

        // we must redirect the user to the proper page now
        // we do this by fetching a new user object
        // and updating props accordingly
        // we get the new user object and then update redux state
        // then we redirect to the new page
        axios.get(`${API_URL}/api/auth/status/`, { withContext: true }).then(res => {
          // delaying updating the props by 2 seconds so the user has time to read the last message
          setTimeout(() => this.props.set_user_details(res.data), 4000)

          // then we redirect to the new page
        }).catch(err => {
          console.log(err)
        });

      } else if (res.data.status === 'invalid_code') {
        this.setState({
          submitting_code: false,
          code_valid: false,
          invalid_code: true
        })
      }

    }).catch((error) => {
      console.log(error)
      this.setState({
        submitting_code: false,
        code_valid: false,
        invalid_code: false
      })
    })

  }

  onSecretMessageChange(e) {
    this.setState({ secret_message: e.target.value })
  }

  onPhoneSubmit(e) {
    // we must prevent default since this is a form submit event handler
    e.preventDefault()

    if (this.state.sending_message || this.state.message_sent) {
      return
    }
    this.setState({ sending_message: true, invalid_number: false, error_sending_message: false })

    // getting the phone number and submitting it
    const data = { phone_number: this.state.phone_number }

    axios.post(`${API_URL}/api/phone/update-number/`, data).then(res => {
      if (res.data.status === 'success') {
        // if the message was sent successfully
        this.setState({
          message_sent: true,
          sending_message: false,
          invalid_number: false,
          error_sending_message: false,

        })
      } else if (res.data.status === 'invalid_number') {
        this.setState({
          message_sent: false,
          sending_message: false,
          invalid_number: true,
          error_sending_message: false
        })
      } else if (res.data.status === 'error') {
        this.setState({
          message_sent: false,
          sending_message: false,
          invalid_number: false,
          error_sending_message: true
        })
      }

    }).catch((error) => {
      console.log(error)
      this.setState({
        message_sent: false,
        sending_message: false,
        invalid_number: false,
        error_sending_message: true
      })
    })

  }

  onPhoneNumberChange(e) {
    this.setState({ phone_number: e.target.value });
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {

    return (
      <div className="Container outer-onboard-container">
        <div
          className={this.state.code_valid ? "onboard-container remove-and-animate-out" : "onboard-container"}
        >

          <p
            style={{ '--animation-order': '0' }}
            className="onboard-p onboard-animate-in">
            Welcome, {this.props.user.first_name}.
          </p>

          <p
            style={{ '--animation-order': '1' }}
            className="onboard-p onboard-animate-in">
            You're in for something a bit <i>different</i> today, we're going to have some fun.
          </p>

          <p
            style={{ '--animation-order': '3' }}
            className="onboard-p onboard-animate-in">
            But first, I'd like to send you a secret code.
            Could you tell me what your phone number is?
          </p>

          <div
            style={{ '--animation-order': '5' }}
            className="onboarding-input-div onboard-animate-in">
            <form onSubmit={this.onPhoneSubmit}>
              <input
                type="text"
                onChange={this.onPhoneNumberChange}
                value={this.state.phone_number}
                placeholder="+1"
                className="input onboarding-input onboard-animate-in"
              ></input>
              {this.state.sending_message ?
                <p className="onboard-sending-message">Sending message...</p>
                : null
              }
              {this.state.invalid_number ?
                <p className="onboard-sending-message">Invalid phone number. Please try again.</p>
                : null
              }
              {this.state.error_sending_message ?
                <p className="onboard-sending-message">An error occurred. Please try again.</p>
                : null
              }

            </form>
          </div>



          {
            this.state.message_sent ?
              <div>
                <p
                  style={{ '--animation-order': '0' }}
                  className="onboard-p onboard-animate-in">
                  Thanks, {this.props.user.first_name}. What's the secret code?
          </p>
                <div
                  style={{ '--animation-order': '1' }}
                  className="onboarding-input-div onboard-animate-in">
                  <form onSubmit={this.onSecretMessageSubmit}>
                    <input
                      onChange={this.onSecretMessageChange}
                      value={this.state.secret_message}
                      placeholder="Secret code"
                      className="input onboarding-input onboard-animate-in"
                    ></input>
                    {this.state.submitting_code ?
                      <p className="onboard-sending-message">Submitting code...</p>
                      : null
                    }
                    {this.state.invalid_code ?
                      <p className="onboard-sending-message">Invalid code. Please try again.</p>
                      : null
                    }
                    {this.state.error_submitting_code ?
                      <p className="onboard-sending-message">An error occurred. Please try again.</p>
                      : null
                    }
                  </form>
                </div>
              </div>
              :
              null
          }

          {
            this.state.code_valid ?
              <p
                style={{ '--animation-order': '0' }}
                className="onboard-p onboard-animate-in">
                You're wonderful, {this.props.user.first_name}.&nbsp;
              <span onClick={this.onBegin}>Let's begin.</span>
              </p>
              :
              null
          }






        </div >
      </div >
    )
  }

}

// this function maps the redux state to props this component can access
const mapStateToProps = state => {
  return {
    app_notifications: state.app_notifications,
    user: state.user,
    items: state.items,
    items_received: state.items_received
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    delete_app_notification,
    receive_items,
    set_items_list,
    set_user_details
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperOnboardingPhone);

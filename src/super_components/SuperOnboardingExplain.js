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


class SuperOnboardingExplain extends Component {

  constructor(props) {
    super(props);

    this.state = {
      response: "",
      submitting_answer: false,
      answer_value: null,
      hide_messages: false

    }

    this.onResponseSubmit = this.onResponseSubmit.bind(this)
    this.onResponseChange = this.onResponseChange.bind(this)
    this.onGoSuperClick = this.onGoSuperClick.bind(this)

  }

  onGoSuperClick(e) {
    this.setState({ hide_messages: true })
    axios.post(`${API_URL}/api/onboarding/set-step/`, { step: 2 }).then(res => {
      // we must redirect the user to the proper page now
      // we do this by fetching a new user object
      // and updating props accordingly
      // we get the new user object and then update redux state
      // then we redirect to the new page
      axios.get(`${API_URL}/api/auth/status/`, { withContext: true }).then(res => {
        // delaying updating the props by 2 seconds so the user has time to read the last message
        setTimeout(() => this.props.set_user_details(res.data), 500)

        // then we redirect to the new page
      }).catch(err => {
        console.log(err)
      });

    }).catch((error) => {
      console.log(error)
    })
  }

  onResponseSubmit(e) {
    e.preventDefault()

    if (this.state.submitting_answer || this.state.answer_value != null) {
      return
    }

    this.setState({ submitting_answer: true })

    const data = { text: this.state.response }
    axios.post(`${API_URL}/api/onboarding/boolean-response/`, data).then(res => {
      console.log(res.data.answer)
      this.setState({
        submitting_answer: false,
        answer_value: res.data.answer
      })

    }).catch((error) => {
      console.log(error)
      this.setState({
        submitting_answer: false,
      })
    })

  }

  onResponseChange(e) {
    if (this.state.submitting_answer || this.state.answer_value != null) {
      return
    }
    this.setState({ response: e.target.value })
  }


  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {

    return (
      <div className="Container outer-onboard-container">
        <div
          className={this.state.hide_messages ? "onboard-container remove-and-animate-out-no-delay" : "onboard-container"}
        >
          <p
            style={{ '--animation-order': '0' }}
            className="onboard-p onboard-animate-in">
            Super is the simplest way to track any metric you want.
          </p>
          <p
            style={{ '--animation-order': '2' }}
            className="onboard-p onboard-animate-in">
            A metric represents an aspect of your life that you're looking to improve.
          </p>
          <p
            style={{ '--animation-order': '4' }}
            className="onboard-p onboard-animate-in">
            If you wanted to go to the gym daily, you
            could create a metric called <strong>Gym</strong> with
            a data type of <strong>yes/no</strong>.
          </p>
          <p
            style={{ '--animation-order': '8' }}
            className="onboard-p onboard-animate-in">
            Updating your metric would be as simple as replying to a text message, like this one.
          </p>
          <p
            style={{ '--animation-order': '11' }}
            className="onboard-p onboard-animate-in">
            Did you go to the gym yesterday, {this.props.user.first_name}?
          </p>

          <div
            style={{ '--animation-order': '12' }}
            className="onboarding-input-div onboard-animate-in">
            <form onSubmit={this.onResponseSubmit}>
              <input
                value={this.state.response}
                onChange={this.onResponseChange}
                type="text"
                placeholder="Your response"
                className="input onboarding-input onboard-animate-in"
              ></input>
              {this.state.submitting_answer ?
                <p className="onboard-sending-message">Sending response...</p>
                : null
              }
              {this.state.answer_value === "YES" ?
                <p
                  style={{ '--animation-order': '0' }}
                  className="onboard-p onboard-animate-in">
                  Well done 💪 with Super, you'll be able to keep that up. Are you ready?
                      </p>
                : null
              }
              {this.state.answer_value === "NO" ?
                <p
                  style={{ '--animation-order': '0' }}
                  className="onboard-p onboard-animate-in">
                  Sorry to hear that.
                  Super is here to help you do better next time.
                  Are you ready?
                      </p>
                : null
              }
              {this.state.answer_value !== null ?
                <button
                  style={{ '--animation-order': '2' }}
                  onClick={this.onGoSuperClick}
                  className="button generic-button go-super-button onboard-animate-in">Get Started</button>
                :
                null
              }

            </form>
          </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(SuperOnboardingExplain);

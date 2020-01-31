import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { delete_app_notification, receive_items, set_items_list } from '../actions/actions.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6


class SuperOnboarding extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {


  }

  componentDidUpdate() {

  }

  render() {

    return (
      <div className="Container">
        <div className="onboard-container">
          <ReactCSSTransitionGroup
            transitionName="onboard-a"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>

            <p className="onboard-p">
              Human behavior is complicated.
            </p>
            <p className="onboard-p">
              Everyone wants to be wealthy, fit, and popular.
            </p>
            <p className="onboard-p">
              If those goals are achievable, why isn't everyone wealthy, fit, and popular?
            </p>
            <p className="onboard-p">

            </p>
            <p className="onboard-p">
              What if <strong>humans</strong> were as programmable as <strong>computers</strong>?
            </p>
            <p className="onboard-p">
              What if there was a software system to assist you in reaching your goals?
            </p>
            <p className="onboard-p">
              Such a tool is not for everyone.
            </p>

          </ReactCSSTransitionGroup>
        </div>
      </div>
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
    set_items_list
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperOnboarding);

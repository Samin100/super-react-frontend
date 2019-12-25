import React, { Component } from 'react';
import '../signup.css';
import axios from 'axios';
import spinner from '../static/images/spinner.svg'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { log_user_out } from '../actions/actions.js'
import { API_URL } from '../index.js';


/*
A component mapped to the /logout route.

It makes a GET request to the logout API endpoint,
dispatches a log_user_out action, then redirects the user
to the /login page.
*/


class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      awaiting_response: true
    }
  }
  componentDidMount() {
    axios.get(`${API_URL}/api/auth/logout/`).then (res => {
      this.setState({awaiting_response: false})
      this.props.log_user_out()
    }).catch (err => {
      this.setState({awaiting_response: false})
      this.props.log_user_out()
    })
  }
  render() {
      return this.state.awaiting_response ? null : <Redirect to="/login" />
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    log_user_out
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(Logout);

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from "react-router-dom";
import LandingPage from './LandingPage.js';
import App from './App.js'
import 'rc-time-picker/assets/index.css';
import NotFound404 from './404.js'
import moment from 'moment';
import { PrivacyPage, TermsPage } from './PrivacyTerms.js';
import { ToastContainer, toast } from 'react-toastify';
import { Provider } from 'react-redux'
import { createStore, bindActionCreators } from 'redux'
import ReactTooltip from 'react-tooltip'
import axios from 'axios';
import spinner_black from './spinner_black.svg'
import { connect } from 'react-redux';
import {
  set_user_details,
  receive_login_response,
  receive_items,
  set_items_list,
  request_item_refresh,
  item_refresh_complete
} from "./actions/actions.js";
import { API_URL } from './index.js';

import IndexPage from './IndexPage.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Authentication components
import Logout from './auth_components/Logout'
import Login from './auth_components/Login'
import Signup from './auth_components/Signup'
import ResetPassword from './auth_components/ResetPassword'
import ResetPasswordConfirmation from './auth_components/ResetPasswordConfirmation'





// a function version of the main component
class Main extends Component {

  render() {

    if (!this.props.login_response_received) {
      return (
        <Router>
        <div className="login-status-spinner-container">
        <img className="login-status-spinner" src={spinner_black} alt="Loading..." />
        </div>
        </Router>

      )
    } else {
      return (
        <div className="global-wrapper">
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnter={false}
          transitionLeave={false}>

          <Router>

          <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/reset-password" component={ResetPassword} />
              <Route path="/reset/:uid/:token" component={ResetPasswordConfirmation} />

              <Route exact path="/privacy" component={PrivacyPage} />
              <Route exact path="/terms" component={TermsPage} />


              <Route path="/" component={IndexPage} />
              <Route component={NotFound404} status={404} />

            </Switch>

          </Router>
          </ReactCSSTransitionGroup>
      </div>
      )
    }

  }

  componentDidMount() {

    // setting the timezone cookie
    var curdate = new Date()
    var offset = curdate.getTimezoneOffset()
    document.cookie = `tz_offset=${offset}`;

    // setting up toast notifications
    toast.configure({
      draggable: false,
      hideProgressBar: true
    });

    if (!this.props.login_response_received) {
      // if we haven't gotten the user's login status yet
      // we make a request to get the status
      axios.get(`${API_URL}/api/auth/status/`, {withContext: true}).then(res => {
        this.props.set_user_details(res.data)
        this.props.receive_login_response()


      }).catch(err => {
        console.log(err)
        this.props.receive_login_response()
      });
    }
  }

  componentDidUpdate() {

        if (this.props.refresh_items) {
          // now we can populate the items array by making a GET request to the items endpoint
          axios.get(`${API_URL}/api/items/get/`, {withContext: true}).then(res => {
            console.log(res.data)
            this.props.set_items_list(res.data.items)
            this.props.item_refresh_complete()

          }).catch(err => {
            console.log(err)
            this.props.item_refresh_complete()
          });
        }
  }
}


// this function maps the redux state to props this component can access
const mapStateToProps = state => {
  return {
    login_response_received: state.login_response_received,
    user: state.user,
    items_received: state.items_received,
    refresh_items: state.refresh_items
  }
}
// the action creators this component should have access to

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    set_user_details,
    receive_login_response,
    receive_items,
    set_items_list,
    request_item_refresh,
    item_refresh_complete
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);

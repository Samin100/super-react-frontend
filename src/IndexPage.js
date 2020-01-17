import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from "react-router-dom";
import LandingPage from './LandingPage.js';
import SuperMain from './super_components/SuperMain.js'
import NotFound404 from './404.js'
import { connect } from 'react-redux';

// import Home from './theme/views/Home'
// import './theme/assets/scss/style.scss'

// The IndexPage component is simply a wrapper component around the LandingPage
// as well as the Super application.
// If a user is logged in, we render the application,
// and if they're not logged in, we render the LandingPage.
function IndexPage(props) {
  if (props.user.logged_in) {
    return <SuperMain />
  } else if (props.match.isExact) {
    // return <Home />
    return <LandingPage />
  } else {
    return <NotFound404 />
  }
}
// this function maps the redux state to props this component can access
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps, null)(IndexPage));

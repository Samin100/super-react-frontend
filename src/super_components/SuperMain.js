import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../spinner.svg'
import { connect, Provider, } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'

import { set_dashboards_list } from '../actions/actions.js'
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from "react-router-dom";
import NotFound404 from '../404.js'
import SuperHome from './SuperHome'
import SuperCreate from './SuperCreate'
import SuperItems from './SuperItems'
import SuperIntegrations from './SuperIntegrations';
import SuperCreateDashboard from './SuperCreateDashboard';
import Dashboard from './SuperDashboard'

import { API_URL } from '../index.js'


class SuperMain extends Component {

  componentWillMount() {

    // getting the user's dashboards to show in the left column
    axios.get(`${API_URL}/api/dashboard/list/`).then(res => {
      console.log(res.data.dashboards)
      this.props.set_dashboards_list(res.data.dashboards)
    }).catch(err => console.log(err))

  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={SuperHome} />
          <Route exact path="/create-dashboard" component={SuperCreateDashboard} />
          <Route exact path="/create" component={SuperCreate} />
          <Route exact path="/integrations" component={SuperIntegrations} />
          <Route path="/items" component={SuperItems} />
          <Route path="/dashboard/:key" component={Dashboard} />
          <Route component={NotFound404} />
        </Switch>
      </div>

    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    set_dashboards_list,
  }, dispatch)
}


export default withRouter(connect(null, mapDispatchToProps)(SuperMain));

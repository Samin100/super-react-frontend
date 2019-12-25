import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../App.css';
import '../Super.css';
import axios from 'axios';
import Chart from 'chart.js';
import { init_chartjs, build_line_chart, render_barchart } from '../charts'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Spinner from '../spinner.svg'
import TimeKeeper from 'react-timekeeper';
import LandingPage from '../LandingPage.js';
import logo_white from '../static/images/logos/super-logo-white.png';
import logo_black from '../static/images/logos/super-logo-black.png';
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'

import svg1 from '../static/images/undraw_blooming_jtv6.svg';

import home from '../static/images/home.svg';
import messages from '../static/images/support.svg';
import security from '../static/images/lock.svg';
import settings from '../static/images/settings.svg';

import hamburger_black from '../static/images/hamburger_black.svg'
import { fake_data } from '../fake_data.js'
import CreateItem from '../CreateItem'

import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from "react-router-dom";
import NotFound404 from '../404.js'
import SuperHome from './SuperHome'
import SuperCreate from './SuperCreate'
import SuperItems from './SuperItems'
import SuperIntegrations from './SuperIntegrations';



class SuperMain extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={SuperHome} />
        <Route exact path="/create" component={SuperCreate} />
        <Route exact path="/integrations" component={SuperIntegrations} />
        <Route exact path="/items" component={SuperItems} />

        <Route component={NotFound404} />
      </Switch>
    )
  }
}

export default SuperMain;

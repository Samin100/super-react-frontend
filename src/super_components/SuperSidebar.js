import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../App.css';
import '../Super.css';
import axios from 'axios';
import Chart from 'chart.js';
import {init_chartjs, build_line_chart, render_barchart} from '../charts'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import LandingPage from '../LandingPage.js';
import logo_white from '../static/images/logos/super-logo-white.png';
import logo_black from '../static/images/logos/super-logo-black.png';
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import svg1 from '../static/images/undraw_blooming_jtv6.svg';

import home from '../static/images/home.svg';
import messages from '../static/images/support.svg';
import security from '../static/images/lock.svg';
import settings from '../static/images/settings.svg';
import spinner from '../static/images/spinner.svg'
import hamburger_black from '../static/images/hamburger_black.svg'
import {fake_data} from '../fake_data.js'
import CreateItem from '../CreateItem'
import Timekeeper from 'react-timekeeper';
import TimePicker from 'rc-time-picker';
import {selectStyles} from '../styles.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { show_app_notification, clear_receive_items, request_item_refresh } from '../actions/actions.js'





class SuperSidebar extends Component {

  render() {
    return "sidebar"
  }


}


export default SuperSidebar;

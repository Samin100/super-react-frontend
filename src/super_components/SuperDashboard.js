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
import { ToastContainer, toast } from 'react-toastify';
import svg1 from '../static/images/undraw_blooming_jtv6.svg';
import home from '../static/images/home.svg';
import messages from '../static/images/support.svg';
import add from '../static/images/add-icon.svg';
import security from '../static/images/lock.svg';
import settings from '../static/images/settings.svg';
import list from '../static/images/list.svg';
import hamburger_black from '../static/images/hamburger_black.svg'
import { fake_data } from '../fake_data.js'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { delete_app_notification, receive_items, set_items_list } from '../actions/actions.js'
import DataInputHome from './DataInputHome'
import { API_URL } from '../index.js';



class Dashboard extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      null
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

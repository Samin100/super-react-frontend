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

import LandingPage from '../LandingPage.js';
import logo_white from '../static/images/logos/super-logo-white.png';
import logo_black from '../static/images/logos/super-logo-black.png';
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import svg1 from '../static/images/undraw_blooming_jtv6.svg';
import add from '../static/images/add-icon.svg';
import home from '../static/images/home.svg';
import messages from '../static/images/support.svg';
import security from '../static/images/lock.svg';
import settings from '../static/images/settings.svg';
import spinner_black from '../static/images/spinner_black.svg'
import list from '../static/images/list.svg';
import hamburger_black from '../static/images/hamburger_black.svg'
import { fake_data } from '../fake_data.js'
import CreateItem from '../CreateItem'
import Timekeeper from 'react-timekeeper';
import TimePicker from 'rc-time-picker';
import { selectStyles } from '../styles.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { show_app_notification, update_dates_dict, clear_dates_dict } from '../actions/actions.js'
import { API_URL } from '../index.js';


const data_options = [
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'text', label: 'Text' },
  { value: 'time', label: 'Time' },

  { value: 'custom', label: 'Custom object' },
]

const data_options_no_custom = [
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'text', label: 'Text' },
  { value: 'time', label: 'Time' },

]

const time_options = [
  { label: 'Seconds', value: 'seconds' },
  { label: 'Minutes', value: 'minutes' },
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' }
]

const frequency_options_active = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly (every 3 months)', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
]

const frequency_options_passive = [
  { label: 'On demand', value: 'on_demand' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly (every 3 months)', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
]

const boolean_options = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' }
]


const Left = () => {
  return (
    <div className="Left">
      <img alt="" src={logo_black} className="left-col-logo" />

      <Link to="/">
        <div className="left-col-menu-item ">
          <img alt="" src={home} className="left-col-icon" />
          <p className="left-menu-item">Home</p>
        </div>
      </Link>

      <Link className="color-white" to="/create">
        <div className="left-col-menu-item">
          <img alt="" src={add} className="left-col-icon" />
          <p className="left-menu-item">Create an Item</p>
        </div>
      </Link>

      <Link className="color-white" to="/items">
        <div className="left-col-menu-item left-col-menu-active">
          <img alt="" src={list} className="left-col-icon" />
          <p className="left-menu-item">Manage Items</p>
        </div>
      </Link>

      <Link className="color-white" to="/integrations">
        <div className="left-col-menu-item">
          <img alt="" src={settings} className="left-col-icon" />
          <p className="left-menu-item">Integrations</p>
        </div>
      </Link>

      <Link className="color-white" to="/logout">
        <div className="left-col-menu-item">
          <img alt="" src={security} className="left-col-icon" />
          <p className="left-menu-item">Sign out</p>
        </div>
      </Link>
      <div className="center">
        <img alt="" src={svg1} className="left-col-svg" />
      </div>

    </div>
  )
}

class SuperItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }


  }


  componentDidMount() {

    axios.get(`${API_URL}/api/items/list/`)
    .then(res => {
      this.setState({loading: true})
      console.log(res.data)

      // if there was an error, we display it in a notification
      if (res.data && res.data.error) {
        toast.error(res.data.error);
      } else {
      }
    })
    .catch((err, res) => {
      this.setState({loading: false})
      console.log(err, res)
    });

  }

  render() {

    if (this.state.redirect_to_app) {
      return <Redirect to="/" />
    }

    const Rows = this.state.items.map((item, index) => {

    });

    if (this.state.loading) {
      return (
        <div className="Container">
          <Left />
  
          <div className="Middle">
            <div className="middle-max-width">
              <div className="middle-container-top ">
                <div className="main-message-box full-width-box middle-container-standard ">
                  <div className="inner-text padding-bottom-10 grey-border-bottom">
                    <p><strong>Your Items</strong></p>
                  </div>
                  <div className="inner-text grey-border-bottom grey-bg">
                  <img className="spinner spinner-content" src={spinner_black} alt=""/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } 

    return (
      <div className="Container">
        <Left />

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top ">
              <div className="main-message-box full-width-box middle-container-standard ">
                <div className="inner-text padding-bottom-10 grey-border-bottom">
                  <p><strong>Your Items</strong></p>
                </div>
                <div className="inner-text grey-border-bottom grey-bg">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    show_app_notification,
    update_dates_dict,
    clear_dates_dict
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(SuperItems);

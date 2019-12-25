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
import {fake_data} from '../fake_data.js'
import CreateItem from '../CreateItem'

import { Link } from 'react-router-dom';
import { API_URL } from '../index.js';


const options = [
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'True/False (Boolean)' },
  { value: 'text', label: 'Text' },
  { value: 'time_duration', label: 'Time duration' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'custom', label: 'Custom object' },
]

const frequency = [
  { label: 'Daily' , value: 'daily' },
  { label: 'Weekly', value: 'weekly'},
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Multiple times per day' , value: 'multiple_per_day' },
  { label: 'Custom frequency', value: 'custom' }
]

class SuperSettings extends Component {

  constructor(props) {
    super(props);

    // an array of valid URLs after /super/
    const pages = [
      'home',
      'new',
      null
    ]
    if (Object.keys([]).length === 0) {
        console.log('home')
    } else if (!pages.includes(props.match.params.page_name)) {
      window.location = '/super'
    } else {
      console.log(props.match.params.page_name)
    }

    this.state = {
      heatmap_data: fake_data('2019-7-06', '2019-8-31', 0, 4),
    };


  }

  componentDidMount() {

    // creating the line chart
    build_line_chart("mychart1")

  }

  render() {

    return (
      <div className="Container">
      <ReactTooltip
      place="top"
      type="dark"
      effect="solid"
      className="heatmap-tooltip"
       />
      <div className="Left">
        <img alt="" src={logo_black} className="left-col-logo" />

        <Link to="/">
        <div className="left-col-menu-item left-col-menu-active">
          <img alt="" src={home} className="left-col-icon" />
          <p className="left-menu-item">Home</p>
        </div>
        </Link>

        <Link to="/messages">
        <div className="left-col-menu-item">
          <img alt="" src={messages} className="left-col-icon" />
          <p className="left-menu-item">Messages</p>
        </div>
        </Link>

        <Link to="/settings">
        <div className="left-col-menu-item">
          <img alt="" src={settings} className="left-col-icon" />
          <p className="left-menu-item">Settings</p>
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

      <div className="Middle">
        <div className="middle-container-top">
            <div className="main-message-box">
            <h1 className="fw-400">Settings</h1>

              <p className="item-header">You're up to date with your tracking!</p>
              <p className="item-header">Items to complete today</p>
            </div>
            <div className="streak-box">
              <p className="item-header">Streak</p>
            </div>

            <div className="items-div">
            <div className="item-row">
                <div className="item-details">
                  <p className="item-header margin-bottom-15">Calories</p>
                  <table>
                  <tbody>
                    <tr>
                      <td className="table-label">Average</td>
                      <td className="table-value">3,320</td>
                    </tr>
                    <tr>
                      <td className="table-label">Distance from target</td>
                      <td className="table-value">+320</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div className="chart-container"><canvas className="chart" id="mychart1"></canvas></div>
              </div>


                <div className="item-row">
                    <div className="item-details">
                      <p className="item-header margin-bottom-15">Meditation</p>
                      <table>
                      <tbody>
                        <tr>
                          <td className="table-label">Average</td>
                          <td className="table-value">22 min</td>
                        </tr>
                        <tr>
                          <td className="table-label">Distance from target</td>
                          <td className="table-value">-8 min</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="heatmap-container">
                    <CalendarHeatmap
                      startDate={new Date('2019-01-01')}
                      endDate={new Date('2019-12-31')}
                      values={this.state.heatmap_data}
                      gutterSize={1}
                      tooltipDataAttrs={(value) => (value.count ? {'data-tip': `${value.date} Meditation: ${value.count}`} : null)}
                      classForValue={(value) => {
                      if (!value) {
                        return 'color-empty';
                      }
                      return `color-scale-${value.count}`;
                    }}
                    />
                    </div>
                  </div>

            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default SuperSettings;

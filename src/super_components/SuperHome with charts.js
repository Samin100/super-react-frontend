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

const options = [
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'True/False (Boolean)' },
  { value: 'text', label: 'Text' },
  { value: 'time_duration', label: 'Time duration' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'custom', label: 'Custom object' },
]

const frequency = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Multiple times per day', value: 'multiple_per_day' },
  { label: 'Custom frequency', value: 'custom' }
]

class SuperMain extends Component {

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

  componentDidUpdate() {

  }

  render() {

    // showing notifications
    this.props.app_notifications.map((message) => {
      console.log(message)
      toast.success(message)
      this.props.delete_app_notification(message)
      return null
    })

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

          <Link className="color-white" to="/create">
            <div className="left-col-menu-item">
              <img alt="" src={add} className="left-col-icon" />
              <p className="left-menu-item">Create an Item</p>
            </div>
          </Link>
          <Link className="color-white" to="/items">
            <div className="left-col-menu-item">
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

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top">
              <DataInputHome />

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
                      tooltipDataAttrs={(value) => (value.count ? { 'data-tip': `${value.date} Meditation: ${value.count}` } : null)}
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

export default connect(mapStateToProps, mapDispatchToProps)(SuperMain);

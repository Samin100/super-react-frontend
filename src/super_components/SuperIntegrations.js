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
import list from '../static/images/list.svg'
import add from '../static/images/add-icon.svg';
import home from '../static/images/home.svg';
import messages from '../static/images/support.svg';
import security from '../static/images/lock.svg';
import settings from '../static/images/settings.svg';
import spinner from '../static/images/spinner.svg'
import hamburger_black from '../static/images/hamburger_black.svg'
import { fake_data } from '../fake_data.js'

import Timekeeper from 'react-timekeeper';
import TimePicker from 'rc-time-picker';
import { selectStyles } from '../styles.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { show_app_notification, clear_receive_items } from '../actions/actions.js'
import { API_URL } from '../index.js';
import LeftColumn from './LeftColumn.js'


// integration logos
import mfp_logo from "../static/images/integrations/myfitnesspal-logo.svg"
import rescuetime_logo from "../static/images/integrations/rescuetime-logo.png"
import strava_logo from "../static/images/integrations/strava-logo.png"
import github_logo from "../static/images/integrations/github-logo.png"


const integrations = [
  { label: "MyFitnessPal", supported: true, logo: mfp_logo },
  { label: "RescueTime", supported: true, logo: rescuetime_logo },
  { label: "Strava", supported: true, logo: strava_logo },
  { label: "GitHub", supported: true, logo: github_logo },
]

class SuperIntegrations extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    const integration_boxes = integrations.map((integration, index) => {
      return (
        <div
          className="integration-box"
          key={index}>


          <div className="integration-box-logo">
            <img className="integration-logo" src={integration.logo} alt={integration.label} />
          </div>

          <div className="integration-box-label">{integration.label}</div>
        </div>
      )
    });

    return (
      <div className="Container">
        <LeftColumn page="integrations" />

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top ">
              <div className="main-message-box full-width-box middle-container-standard ">
                <div className="inner-text grey-border-bottom">
                  <p><strong>Add an Integration</strong></p>
                  <p className="item-option-header-small normal-weight">
                    Integrations let you automatically import data from external sources into Super.
                <br />
                    <br />
                    Integrations are still currently being tested. For beta access or to request an integration, please email <strong className="purple">hello@gosuper.io</strong>.
                </p>
                </div>
                <div className="integration-boxes-wrapper">
                  {integration_boxes}
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
    clear_receive_items
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(SuperIntegrations);

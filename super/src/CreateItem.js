import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './App.css';
import './Super.css';
import axios from 'axios';
import Chart from 'chart.js';
import {init_chartjs, build_line_chart, render_barchart} from './charts'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Spinner from './spinner.svg'
import TimeKeeper from 'react-timekeeper';
import LandingPage from './LandingPage.js';
import logo_white from './static/images/logos/super-logo-white.png';
import Select from 'react-select'

import svg1 from './static/images/undraw_blooming_jtv6.svg';
import home from './static/images/home.svg';
import messages from './static/images/support.svg';
import security from './static/images/lock.svg';
import settings from './static/images/settings.svg';
import hamburger_black from './static/images/hamburger_black.svg'
import {fake_data} from './fake_data.js'



class CreateItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {


  }

  render() {
    return (

      <div className="Middle">
        <div className="middle-container-top">
            <div className="items-div">
                <div className="item-row">
                    <div className="item-details">
                      <p className="item-header margin-bottom-15">Create a new item</p>
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

                    </div>
                  </div>

            </div>
          </div>
        </div>
    )
  }

}

export default CreateItem;

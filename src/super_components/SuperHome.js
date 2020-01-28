import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import axios from 'axios';
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
import { fake_data } from '../chart_utils.js'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { delete_app_notification, receive_items, set_items_list } from '../actions/actions.js'
import DataInputHome from './DataInputHome'

import LeftColumn from './LeftColumn.js'

class SuperHome extends Component {

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
    // build_line_chart("mychart1")


    // showing notifications
    this.props.app_notifications.map((message) => {
      console.log(message)
      toast.success(message)
      this.props.delete_app_notification(message)
      return null
    })

  }

  componentDidUpdate() {

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
        <LeftColumn page="home" />
        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top">
              <DataInputHome />
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

export default connect(mapStateToProps, mapDispatchToProps)(SuperHome);

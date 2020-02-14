import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';

import axios from 'axios';
import Spinner from '../spinner.svg'
import TimeKeeper from 'react-timekeeper';
import LandingPage from '../LandingPage.js';
import logo_white from '../static/images/logos/super-logo-white.png';
import logo_black from '../static/images/logos/super-logo-black.png';
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';

import spinner_black from '../static/images/spinner_black.svg'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { show_app_notification, delete_app_notification, receive_items, set_items_list, set_variables_list, set_dashboards_list } from '../actions/actions.js'
import { API_URL } from '../index.js';
import NotFound404 from '../404.js'
import LeftColumn from './LeftColumn.js'
import GridLayout from 'react-grid-layout';
import ReactMarkdown from 'react-markdown'
import Modal from 'react-modal';
import { selectStylesSmall } from '../styles.js';
import spinner_white from '../static/images/spinner.svg'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-xcode";
import Handlebars from 'handlebars'
import Chart from 'chart.js';
import { CirclePicker } from 'react-color'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Color } from 'color'

import equal from 'deep-equal'

// the default chart color
const INITIAL_CHART_COLOR = '#00bcd4'

const text_align_options = [
    {
        'value': 'left',
        'label': 'Left'
    },
    {
        'value': 'center',
        'label': 'Center'
    },
    {
        'value': 'right',
        'label': 'Right'
    },
]


const calculation_options_number = [
    {
        'value': 'average',
        'label': 'Average',
        'rtype': 'NUMBER',
        'needs_range': true,
    },
    {
        'value': 'sum',
        'label': 'Sum',
        'rtype': 'NUMBER',
        'needs_range': true,
    },
    {
        'value': 'min',
        'label': 'Minimum value',
        'rtype': 'NUMBER',
        'needs_range': true,
    },
    {
        'value': 'max',
        'label': 'Maximum value',
        'rtype': 'NUMBER',
        'needs_range': true,
    },
    {
        'value': 'latest_val',
        'label': 'Latest value',
        'rtype': 'NUMBER',
        'needs_range': false,
    },
    {
        'value': 'target_val',
        'label': 'Target value',
        'rtype': 'NUMBER',
        'needs_range': false,
    }

]

const calculation_options_boolean = [
    {
        'value': 'num_yes',
        'label': 'Number of yes values',
        'rtype': 'NUMBER',
        'needs_range': true,
    },
    {
        'value': 'num_no',
        'label': 'Number of no values',
        'rtype': 'NUMBER',
        'needs_range': true,
    },
    {
        'value': 'most_frequent',
        'label': 'Most frequent value',
        'rtype': 'BOOLEAN',
        'needs_range': true,
    },
    {
        'value': 'latest_val',
        'label': 'Latest value',
        'rtype': 'BOOLEAN',
        'needs_range': false,
    },
    {
        'value': 'target_val',
        'label': 'Target value',
        'rtype': 'BOOLEAN',
        'needs_range': false,
    }
]

const calculation_options_text = [
    {
        'value': 'specific_entry',
        'label': 'Get a specific entry',
        'rtype': 'TEXT',
        'needs_range': true,
    },
    {
        'value': 'latest_entry',
        'label': 'Get the latest entry',
        'rtype': 'TEXT',
        'needs_range': false,
    }
]

const calculation_options_time = [
    {
        'value': 'average_time',
        'label': 'Average value',
        'rtype': 'TIME'
    },
    {
        'value': 'latest_time',
        'label': 'Latest value',
        'rtype': 'TIME'
    }
]


const time_range_options = [
    {
        'value': '1 day',
        'label': 'Last day'
    }
]

const modalStyles = {
    content: {
        top: '320px',
        left: '50%',
        right: 'auto',
        marginRight: '-50%',
        width: '400px',
        height: 'fit-content',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible'
    }
};

// const dummy_rechart_data = [
//   { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//   { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//   { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
//   { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
//   { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
//   { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
//   { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
// ];

let dummy_rechart_data = []
for (let i = 0; i < 8; i++) {
    dummy_rechart_data.push({
        uv: Math.floor(Math.random() * i * 100)
    })
}


const components = [
    {
        name: 'Text block',
        description: 'A block of text. Good for documenting your dashboard.',
        value: 'text'
    },
    {
        name: 'Line chart',
        description: 'Display a line chart.',
        value: 'line_chart'
    },
    {
        name: 'Bar chart',
        description: 'Display a bar chart.',
        value: 'bar_chart'
    },
    {
        name: 'Heatmap',
        description: 'Useful for displaying daily numeric data.',
        value: 'heatmap'
    },
    {
        name: 'Table',
        description: 'A table used to display data.',
        value: 'table'
    },
]

class PublicDashboard extends Component {
    constructor(props) {
        super(props);
    }
}


// this function maps the redux state to props this component can access
const mapStateToProps = state => {
    return {
        app_notifications: state.app_notifications,
        user: state.user,
        dashboards: state.dashboards,
        items: state.items,
        variables: state.variables
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        delete_app_notification,
        receive_items,
        set_items_list,
        show_app_notification,
        set_variables_list,
        set_dashboards_list
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicDashboard);

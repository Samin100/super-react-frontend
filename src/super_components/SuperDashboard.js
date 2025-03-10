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


class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show_autosave_message: false,
      dashboard_404: false,
      key: props.match.params.key,
      hide_leftcol: false,
      visible_components: components,
      component_search: "",
      layout: [],
      element_being_dragged: null,
      type_being_dragged: null,
      active_component: null,
      items: [],
      variables: [],
      selected_variable: null,
      show_variable_modal: false,
      variable_item_select: null,
      variable_calc_select: null,
      day_count: "",
      variable_name: "",
      variable_validation_errors: [],
      submitting_variable: false,
      show_delete_dashboard_modal: false,
      redirect_to: null,
      colorpicker_color: INITIAL_CHART_COLOR,
      last_autosave_dict: {},
      changing_dashboard_visibility: false,
      window_width: window.innerWidth
    }

    this.toggleColumn = this.toggleColumn.bind(this)
    this.onComponentSearch = this.onComponentSearch.bind(this)

    this.onElementDrop = this.onElementDrop.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this)
    this.onElementTypeMouseDown = this.onElementTypeMouseDown.bind(this)
    this.generateElementComponent = this.generateElementComponent.bind(this)
    this.onComponentClick = this.onComponentClick.bind(this)
    this.onEscapeKeydown = this.onEscapeKeydown.bind(this)
    this.onLayoutClick = this.onLayoutClick.bind(this)
    this.onTextTextareaChange = this.onTextTextareaChange.bind(this)
    this.onDeleteElementClick = this.onDeleteElementClick.bind(this)

    this.onDragStop = this.onDragStop.bind(this)
    this.onShowCreateVariableModal = this.onShowCreateVariableModal.bind(this)
    this.closeVariableModal = this.closeVariableModal.bind(this)

    this.onVariableItemSelectChange = this.onVariableItemSelectChange.bind(this)
    this.onVariableCalcSelectChange = this.onVariableCalcSelectChange.bind(this)
    this.onCreateVariableClick = this.onCreateVariableClick.bind(this)
    this.onVariableNameChange = this.onVariableNameChange.bind(this)
    this.onDayCountChange = this.onDayCountChange.bind(this)
    this.onVariableSelectChange = this.onVariableSelectChange.bind(this)
    this.renderHandlebars = this.renderHandlebars.bind(this)

    this.showDeleteDashboardModal = this.showDeleteDashboardModal.bind(this);
    this.closeDeleteDashboardModal = this.closeDeleteDashboardModal.bind(this);
    this.onDeleteDashboardClick = this.onDeleteDashboardClick.bind(this)

    this.onUpdateTextAlign = this.onUpdateTextAlign.bind(this)
    this.onColorPickerChangeComplete = this.onColorPickerChangeComplete.bind(this)

    this.onChartMetricChange = this.onChartMetricChange.bind(this)
    this.onDeleteChartMetric = this.onDeleteChartMetric.bind(this)
    this.onChartTitleChange = this.onChartTitleChange.bind(this)
    this.onChartDescriptionChange = this.onChartDescriptionChange.bind(this)

    this.onTargetLineValueChange = this.onTargetLineValueChange.bind(this)
    this.onTargetLineLabelChange = this.onTargetLineLabelChange.bind(this)

    this.onRemoveActiveComponent = this.onRemoveActiveComponent.bind(this)

    this.autosaveDashboard = this.autosaveDashboard.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.onToggleDashboardVisibility = this.onToggleDashboardVisibility.bind(this)
    this.fetch_new_dashboards = this.fetch_new_dashboards.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    this.onChartDaysToFetchChange = this.onChartDaysToFetchChange.bind(this)

  }

  onChartDaysToFetchChange(e) {
    if (!/^\d+$/.test(e.target.value) && e.target.value !== "") {
      // we only allow digits and empty strings
      return
    }

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));


    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            days_to_fetch: e.target.value
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })
  }

  onWindowResize() {
    this.setState({ window_width: window.innerWidth })
  }

  fetch_new_dashboards() {
    console.log('fetching new dashboards')
    // getting the user's dashboards to show in the left column
    axios.get(`${API_URL}/api/dashboard/list/`).then(res => {
      this.props.set_dashboards_list(res.data.dashboards)
    }).catch(err => console.log(err))
  }

  onToggleDashboardVisibility() {
    console.log('this.state.dashboard.edit_mode', this.state.dashboard.edit_mode)

    if (this.state.changing_dashboard_visibility) {
      return
    }

    this.setState({ changing_dashboard_visibility: true })

    const data = {
      edit_mode: !this.state.dashboard.edit_mode,
      key: this.state.dashboard.key
    }

    axios.post(`${API_URL}/api/dashboard/set-edit-mode/`, data).then(response => {
      this.setState({
        changing_dashboard_visibility: false,
        dashboard: {
          ...this.state.dashboard,
          edit_mode: !this.state.dashboard.edit_mode
        }
      })

      this.props.set_dashboards_list(response.data.dashboards)

    }).catch(error => {
      this.setState({ changing_dashboard_visibility: false })
    })
  }

  toggleEditMode(e) {
    console.log('change edit mode!')
  }

  autosaveDashboard() {

    if (!this.state.dashboard) {
      return
    }
    let data = {
      dashboard: JSON.parse(JSON.stringify(this.state.dashboard)),
      layout: JSON.parse(JSON.stringify(this.state.layout)),
    }

    // we only autosave if the last update is not equal to the current update
    if (equal(this.state.last_autosave_dict, data)) {
      return
    }

    let dashboards_clone = JSON.parse(JSON.stringify(this.props.dashboards))

    let new_dashboards = dashboards_clone.map(dashboard => {
      if (this.state.dashboard.key === dashboard.key) {
        return {
          ...dashboard,
          layout: this.state.layout
        }
      }
      return dashboard
    })
    console.log('new dahsboards')
    console.log(new_dashboards)
    // we must update redux state
    this.props.set_dashboards_list(new_dashboards)

    // otherwise we submit the post request
    axios.post(`${API_URL}/api/dashboard/update/`, data).then(response => {
      this.setState({ last_autosave_dict: data })
    }).catch(error => {
      console.log(error)
    })

  }

  onRemoveActiveComponent(e) {
    this.setState({ active_component: null })
  }

  onTargetLineLabelChange(e) {

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));


    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            chart_target_label: e.target.value
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })
  }

  onTargetLineValueChange(e) {
    if (!/^\d+$/.test(e.target.value) && e.target.value !== "") {
      // we only allow digits and empty strings
      return
    }

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));


    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            chart_target_value: e.target.value
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })

  }

  onDeleteChartMetric(e) {
    // when a metric is deleted from a chart
    let delete_key = e.currentTarget.dataset.key

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));


    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {

        let new_selected_metrics_list = []

        for (let j = 0; j < component.data.selected_metrics.length; j++) {
          // skipping the component to delete
          if (component.data.selected_metrics[j].key === delete_key) {
            continue
          }

          new_selected_metrics_list.push(component.data.selected_metrics[j])

        }

        return {
          ...component,
          data: {
            ...component.data,
            formatting_error: false,
            selected_metrics: new_selected_metrics_list
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })
  }

  onChartMetricChange(e) {
    // when the user clicks on a metric from the dropdown to add to a chart
    console.log(e)

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));

    // if this metric already exists in the active metric list, we ignore it
    let already_exists = false

    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {

        let new_selected_metrics_list = [...component.data.selected_metrics]

        for (let j = 0; j < new_selected_metrics_list.length; j++) {

          // if the metric already exists, we set already_exists to true and return before we update state
          if (new_selected_metrics_list[j].key === e.key) {
            already_exists = true
            break
          }
        }

        new_selected_metrics_list.push(e)

        return {
          ...component,
          data: {
            ...component.data,
            formatting_error: false,
            selected_metrics: new_selected_metrics_list
          }
        }
      } else {
        return component
      }
    })


    if (already_exists) {
      return
    }

    this.setState({ layout: new_layout })
  }

  onChartDescriptionChange(e) {

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));


    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            chart_description: e.target.value
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })

  }
  onChartTitleChange(e) {
    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));

    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            chart_title: e.target.value
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })

  }

  onColorPickerChangeComplete(e) {
    // when the color picker changes we update the element's color value

    // the index of the component to update
    let i = parseInt(this.state.active_component)

    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));


    let new_layout = layout_clone.map((component, index) => {
      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            color: e.hex
          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })

  }

  onUpdateTextAlign(e) {

    // the index of the component to update
    let i = parseInt(this.state.active_component)
    console.log(i)


    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));

    let new_layout = layout_clone.map((component, index) => {

      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            formatting_error: false,
            align: e,

          }
        }
      } else {
        return component
      }
    })

    this.setState({ layout: new_layout })
  }

  onDeleteDashboardClick(e) {
    if (!this.state.dashboard) {
      return
    }

    let data = { key: this.state.dashboard.key }

    axios.post(`${API_URL}/api/dashboard/delete/`, data).then(response => {
      console.log(response.data.dashboards)
      console.log('updating state')
      this.props.set_dashboards_list(response.data.dashboards)
      console.log('done setting dashboards')
      this.setState({ dashboard: null, redirect_to: "/", show_delete_dashboard_modal: false })


    }).catch(error => {
    })
  }

  showDeleteDashboardModal(e) {
    this.setState({ show_delete_dashboard_modal: true })
  }

  closeDeleteDashboardModal() {
    this.setState({ show_delete_dashboard_modal: false })
  }



  onVariableSelectChange(variable) {

    if (!variable) {
      return
    }
    console.log(variable)


    // the index of the component to update
    let i = parseInt(this.state.active_component)
    console.log(i)


    // creating a clone of the existing layout
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));

    let new_layout = layout_clone.map((component, index) => {

      // we prepend a space to the variable if the last character of the text field is a not a space
      let new_text = ""
      if (component.data.text.length > 0 && component.data.text.charAt(component.data.text.length - 1) !== " ") {
        new_text = component.data.text.concat(` {{${variable.name}}}`)
      } else {
        new_text = component.data.text.concat(`{{${variable.name}}}`)
      }

      // updating the component's text value by adding the variable to it
      if (parseInt(component.i) === i) {
        return {
          ...component,
          data: {
            ...component.data,
            text: new_text,
            formatting_error: false
          }
        }
      } else {
        return component
      }
    })

    this.setState({ selected_variable: null, layout: new_layout })
  }

  onDayCountChange(e) {
    let value = /^\d+$/.test(e.target.value) || e.target.value === "" ? e.target.value : this.state.day_count
    this.setState({ day_count: value })
  }

  onVariableNameChange(e) {

    let text = e.target.value

    // empty strings are allowed
    if (text === "") {
      this.setState({ variable_name: text })
    }

    // only alphanum chars and '-' and '_' are allowed in variable names
    var letters = /^[0-9a-zA-Z_-]+$/;
    if (!text.match(letters)) {
      return
    }

    if (e.target.value.length > 256) {
      // max variable length is 256 characters
      return
    }
    this.setState({ variable_name: text })
  }

  onCreateVariableClick(e) {
    console.log('create variable click')

    let variable_validation_errors = []

    if (!this.state.variable_item_select) {
      variable_validation_errors.push("Please select an item.")
    }

    if (!this.state.variable_calc_select) {
      variable_validation_errors.push("Please select a calculation.")
    }

    if (this.state.day_count === "" &&
      (this.state.variable_calc_select && this.state.variable_calc_select.needs_range)) {
      // todo : fix the need range value when the object is null

      variable_validation_errors.push("Please select a day count.")
    }

    if (this.state.variable_name === "") {
      variable_validation_errors.push("Please enter a variable name.")
    }

    // updating state 
    this.setState({ variable_validation_errors: variable_validation_errors })
    if (variable_validation_errors.length > 0) {
      return
    }

    // now we can begin submitting the variable
    if (this.state.submitting_variable) {
      return
    } else {
      this.setState({ submitting_variable: true })
    }



    let range = this.state.variable_calc_select.needs_range ? parseInt(this.state.day_count) : null

    // if there are no errors, we can submit the variable
    const data = {
      name: this.state.variable_name,
      item_key: this.state.variable_item_select.key,
      calculation: this.state.variable_calc_select,
      range: range
    }

    axios.post(`${API_URL}/api/dashboard/create-variable/`, data).then(res => {
      let variables = res.data.variables
      // updating the global variables list with the new variables list in the response
      this.props.set_variables_list(variables)
      this.setState({ submitting_variable: false, show_variable_modal: false })

    }).catch(error => {
      this.setState({ submitting_variable: false })
    })


  }

  onVariableCalcSelectChange(e) {
    this.setState({ variable_calc_select: e })
  }

  onVariableItemSelectChange(e) {
    this.setState({ variable_item_select: e, variable_calc_select: null })
  }


  closeVariableModal(e) {
    this.setState({ show_variable_modal: false })
  }
  onShowCreateVariableModal(e) {
    // show the create a variable modal
    this.setState({ show_variable_modal: true })
  }

  onDragStop(e) {

  }

  onDeleteElementClick(e) {
    let key = parseInt(e.currentTarget.dataset.key)

    // making a clone of the existing layout array
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout));

    // searching for the index of the element to delete
    let index_to_delete = -1;
    for (let i = 0; i < layout_clone.length; i++) {

      if (parseInt(layout_clone[i].i) === parseInt(this.state.active_component)) {
        index_to_delete = i
        break
      }

    }
    // deleting the component from the layout array
    if (index_to_delete === -1) {
      console.log("ERROR: active_component not found", this.state.active_component)
    }
    layout_clone.splice(index_to_delete, 1)
    this.setState({ active_component: null, layout: layout_clone })
  }

  renderHandlebars(source) {
    // this takes a string and renders all the variables inside the handlebars brackets

    let template = null
    try {
      template = Handlebars.compile(source)
    } catch (e) {
      console.log(e)
    }



    if (!template) {
      return source
    }

    // building the data object that handlebars will use to populate the template
    let data = {}

    for (let i = 0; i < this.props.variables.length; i++) {
      data[this.props.variables[i].name] = this.props.variables[i].value
    }

    console.log(data)

    let compiled = null
    try {
      compiled = template(data)
    } catch (err) {
      console.log(err)
    }

    if (!compiled) {
      return source
    }
    console.log(compiled)
    return compiled


  }

  onTextTextareaChange(e) {
    console.log(e)

    // event handler for when when a text element's text area is changed
    let key2 = parseInt(this.state.active_component)

    // creating a new layout array
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout))

    let new_layout = []
    layout_clone.map((element, index) => {
      if (parseInt(element.i) === key2) {

        new_layout.push({
          ...element,
          data: {
            ...element.data,
            text: e
          }

        })
      } else {
        new_layout.push(element)
      }
      return null
    })

    console.log(new_layout)


    this.setState({ layout: new_layout })
  }


  onLayoutClick(e) {
    if (e.target.classList.contains("layout")) {
      // if the click was on the layout, we blur the active component
      this.setState({ active_component: null })

    }

  }

  onEscapeKeydown(e) {
    // contrary to this function name, this is called when any button is pressed
    // we clear the active element when the escape button is pressed

    if ((e.ctrlKey || e.metaKey) && e.which === 83) {

      if (this.state.dashboard && !this.state.dashboard.edit_mode) {
        return
      }
      // Save Function on ctrl/cmd + s 
      e.preventDefault();
      this.setState({ show_autosave_message: true, autosave_time: moment() })
      this.autosaveDashboard()

      setTimeout(() => {
        if (moment().diff(this.state.autosave_time, 'seconds') > 4) {
          this.setState({ show_autosave_message: false })
        }
      }, 5000);
    }

    // we ignore any keypresses if the user is typing
    if (document.activeElement.nodeName === "INPUT" || document.activeElement.nodeName === "TEXTAREA") {
      return
    }


    if (e.key === 'Escape') {

      this.setState({ active_component: null })
    } else if ((e.key === "Backspace" || e.key === "Delete")) {
      if (this.state.active_component === null) {
        // if there is no active component, we don't do anything
        return
      }

      // making a clone of the existing layout array
      let layout_clone = JSON.parse(JSON.stringify(this.state.layout));

      // searching for the index of the element to delete
      let index_to_delete = -1;
      for (let i = 0; i < layout_clone.length; i++) {

        if (parseInt(layout_clone[i].i) === parseInt(this.state.active_component)) {
          index_to_delete = i
          break
        }

      }
      // deleting the component from the layout array
      if (index_to_delete === -1) {

      }
      layout_clone.splice(index_to_delete, 1)
      this.setState({ active_component: null, layout: layout_clone })
      e.preventDefault();
    }
  }

  onComponentClick(e) {
    this.setState({ active_component: parseInt(e.currentTarget.dataset.key) })
  }



  onElementTypeMouseDown(e) {
    // when a user has their mouse down on an element, we set it as the type_being_dragged
    // this is so we know what type of element to create if they drop it in the canvas in onElementDrop()
    this.setState({ type_being_dragged: e.currentTarget.dataset.type })
  }

  onLayoutChange(layout) {
    // callback for when the layout changes so we can update state

    let new_layout = []
    for (let i = 0; i < layout.length; i++) {
      if (layout[i].i === "ghost_element") {
      } else {
        let type = null;
        let data = null
        for (let j = 0; j < this.state.layout.length; j++) {
          if (this.state.layout[j].i === layout[i].i) {
            type = this.state.layout[j].type
            data = JSON.parse(JSON.stringify(this.state.layout[j].data))
            break
          }
        }

        new_layout.push({
          ...layout[i],
          type: type,
          data: {
            ...data
          }
        })
      }
    }

    // i need to corroberate layout in layout with the layout elements in layout state
    this.setState({ layout: new_layout })
  }

  generateElementComponent(element) {

    switch (element.type) {
      case "text":

        let CSS = "db-component"
        if (element.data.align.value === "left") {
          CSS = "db-component align-left"
        } else if (element.data.align.value === "center") {
          CSS = "db-component align-center"
        } else if (element.data.align.value === "right") {
          CSS = "db-component align-right"
        }
        return (
          <div className={CSS}>
            <ReactMarkdown source={this.renderHandlebars(element.data.text)} />
          </div>
        )
      case "line_chart":

        let TitleCSS = "dashboard-chart-title"
        let DescriptionCSS = "dashboard-chart-description"
        if (element.data.align.value === "left") {
          TitleCSS = "dashboard-chart-title align-left"
          DescriptionCSS = "dashboard-chart-description align-left"
        } else if (element.data.align.value === "center") {
          TitleCSS = "dashboard-chart-title align-center"
          DescriptionCSS = "dashboard-chart-description align-center"
        } else if (element.data.align.value === "right") {
          TitleCSS = "dashboard-chart-title align-right"
          DescriptionCSS = "dashboard-chart-description align-right"
        }

        const CustomizedAxisTick = props => {
          const { x, y, payload } = props
          return (
            <g transform={`translate(${x},${y})`}>
              <text dy={16} textAnchor='middle' fill='#666'>{payload.value}</text>
            </g>
          )
        }

        return (
          <div className="db-component db-component-chart">
            <p className={TitleCSS}>{element.data.chart_title}</p>
            <p className={DescriptionCSS}>
              {element.data.chart_description}
            </p>
            <div className="dashboard-chart-wrapper">

              <ResponsiveContainer>
                <AreaChart
                  data={dummy_rechart_data}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`chart-color-${element.i.trim()}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={element.data.color} stopOpacity={0.9} />
                      <stop offset="95%" stopColor={element.data.color} stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis tick={<CustomizedAxisTick />} />
                  {/* <YAxis domain={['dataMin - 100', 'dataMax + 100']} /> */}
                  <YAxis />
                  <Tooltip />
                  <Area type='monotone' dataKey='uv' stroke={element.data.color} fill={`url(#chart-color-${element.i.trim()})`} />
                  {element.data.chart_target_value !== "" ?
                    <ReferenceLine y={element.data.chart_target_value} label={{ value: element.data.chart_target_label, fill: 'auto' }} stroke={element.data.color} />
                    : null
                  }

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      // case "table":
      //   HTML = "Table"
      //   break
      // case "bar_chart":
      //   HTML = "Bar chart"
      //   break
      // case "line_chart":
      //   HTML = "Line chart"
      //   break
      // case "heatmap":
      //   HTML = "Heat map"
      //   break
      default:
        return (
          <div className="db-component">
            <div className="db-number">47</div>
            <div className="db-number-text">Click to edit</div>
          </div>
        )
    }
  }

  onElementDrop(element) {


    let new_key = 0;
    // if there are no existing elements, we can set the key to 0
    if (this.state.layout.length !== 0) {
      // otherwise, we generate a new key for the element
      let curr_indexes = this.state.layout.map((e, index) => {
        return e.i
      })
      // setting the new key to the current highest index + 1
      new_key = Math.max(...curr_indexes) + 1;
    }

    // creating the new element
    let new_element = {
      ...element,
      i: `${new_key} `,
      type: this.state.type_being_dragged,
      data: {
        text: "Click to edit!",
        align: { label: 'Left', value: 'left' },
        selected_metrics: [],
        color: INITIAL_CHART_COLOR,
        chart_target_value: "",
        chart_target_label: "",
        chart_title: "",
        chart_description: ""
      }
    }

    if (new_element.x === undefined ||
      new_element.y === undefined ||
      new_element.w === undefined ||
      new_element.h === undefined) {
      console.log('element has an undefined value:')
      return

    }


    // creating a deep copy of the existing canvas layout
    let new_layout = JSON.parse(JSON.stringify(this.state.layout));

    new_layout.push(new_element)

    // updating state with the new layout
    this.setState({ layout: new_layout, active_component: new_key })

    // autosaving the dashboard
    this.autosaveDashboard()
  }


  onComponentSearch(e) {

    let matched_components = []
    let term = e.target.value.trim()

    for (let i = 0; i < components.length; i++) {
      if (components[i].name.includes(term) || components[i].description.includes(term)) {
        matched_components.push({ ...components[i] })
      }
    }

    this.setState({ component_search: e.target.value, visible_components: matched_components })

  }

  toggleColumn() {

    this.setState({ hide_leftcol: !this.state.hide_leftcol })
  }

  componentDidUpdate(prevProps, prevState) {
    // update state 

    // if the key changed
    if (prevProps.match.params.key !== this.props.match.params.key) {

      let dashboard = null
      let layout = []
      if (this.props.dashboards !== null) {
        for (let i = 0; i < this.props.dashboards.length; i++) {
          if (this.props.dashboards[i].key === this.props.match.params.key) {
            dashboard = this.props.dashboards[i]
            if (dashboard) {
              layout = dashboard.layout
            }
            break
          }
        }
      }
      this.setState({
        key: this.props.match.params.key,
        dashboard: dashboard, layout: layout,
        active_component: null
      })
      return
    }

    if (!this.state.dashboard_404 && this.props.dashboards !== null && !this.state.dashboard) {
      let dashboard = null
      let layout = []

      for (let i = 0; i < this.props.dashboards.length; i++) {
        if (this.props.dashboards[i].key === this.props.match.params.key) {
          dashboard = this.props.dashboards[i]
          console.log(dashboard)
          if (dashboard) {
            layout = dashboard.layout
          }
          break
        }
      }
      if (!dashboard) {
        this.setState({ dashboard_404: true, dashboard: dashboard })
      }
      this.setState({ dashboard: dashboard, layout: layout, active_component: null })
      return
    }

  }

  componentDidMount() {

    axios.get(`${API_URL}/api/dashboard/get-variables/`)
      .then(res => {
        this.props.set_variables_list(res.data.variables)
      })
      .catch((err, res) => {
        console.log(err)
      });


    axios.get(`${API_URL}/api/items/list/`)
      .then(res => {
        this.setState({
          loading_items: false,
          items: res.data.items,
        })

        // if there was an error, we display it in a notification
        if (res.data && res.data.error) {
          toast.error(res.data.error);
        } else {
        }
      })
      .catch((err, res) => {

      });


    // handling all the key presses in this function
    window.addEventListener('keydown', this.onEscapeKeydown);

    // the interval for the autosave - we autosave every second
    this.autosave_interval = setInterval(this.autosaveDashboard, 1000)

    // fetching the new dashboard from the API every 10 seconds
    this.fetch_dashboards_interval = setInterval(this.fetch_new_dashboards, 10000);


    // the resize event handler
    window.addEventListener('resize', this.onWindowResize);



  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscapeKeydown);
    clearInterval(this.autosave_interval)
    clearInterval(this.fetch_dashboards_interval);
    window.removeEventListener('resize', this.onWindowResize)
  }



  render() {

    if (this.state.redirect_to) {
      return <Redirect to={this.state.redirect_to} />
    }

    let dashboard = null

    // showing a spinner if the dashboards list hasn't been populated yet
    if (this.props.dashboards == null) {
      return (
        <div className="Container">
          <LeftColumn
            dashboard_key={dashboard ? dashboard.key : null}
          />

          <div className="inner-container">
            <div className="create-dashboard-div">
              <img className="spinner spinner-content" src={spinner_black} alt="" />
            </div >
          </div >
        </div >
      )
    } else if (this.props.dashboards.length === 0) {
      return (
        <div className="Container">
          <LeftColumn
            dashboard_key={dashboard ? dashboard.key : null}
          />

          <div className="inner-container">
            <div className="middle-col">
              <div className="create-dashboard-div text-center">
                <h1 className="dashboard-not-found">Dashboard not found</h1>
              </div >
            </div >
          </div >
        </div >
      )
    } else {

      for (let i = 0; i < this.props.dashboards.length; i++) {
        if (this.props.dashboards[i].key === this.state.key) {
          dashboard = this.props.dashboards[i]
        }
      }
      if (dashboard == null) {
        // if the dashboard doesn't exist, we show an error message
        return (
          <div className="Container">
            <LeftColumn
              dashboard_key={dashboard ? dashboard.key : null}
            />

            <div className="inner-container">
              <div className="middle-col">
                <div className="create-dashboard-div text-center">
                  <h1 className="dashboard-not-found">Dashboard not found</h1>
                </div >
              </div >
            </div >
          </div >
        )
      }
    }

    // if the dashboard is not null
    // we render it

    let edit_mode = this.state.dashboard ? this.state.dashboard.edit_mode : false
    console.log('edit_mode', edit_mode)

    let RightComponents;
    // rendering the components for the right sidebar
    if (this.state.visible_components.length > 0) {
      RightComponents = this.state.visible_components.map((component, index) => {
        return (
          <div
            data-type={component.value}
            onMouseDown={this.onElementTypeMouseDown}
            key={index}
            className="droppable-element side-component-item"
            draggable={edit_mode}
            unselectable="on"
            // this is a hack for firefox
            // Firefox requires some kind of initialization
            // which we can do by adding this attribute
            // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
            onDragStart={e => e.dataTransfer.setData("text/plain", "")}
          >
            <p className="side-component-name">{component.name}</p>
            <p className="side-component-description">{component.description}</p>
          </div>
        )
      })
    } else {
      RightComponents = <p className="side-component-description no-components-found">No components found</p>
    }

    // creating the child components that go inside the React Grid component
    let Elements = this.state.layout.map((element, index) => {

      let component_className = ""
      if (!edit_mode) {
        if (element.type === "text") {
          component_className = "component-wrapper-published published-text-wrapper"
        } else {
          component_className = "component-wrapper-published"
        }

      } else {
        component_className = this.state.active_component === parseInt(element.i) ? "component-wrapper active-component" : "component-wrapper"
      }
      return (
        <div
          onClick={this.onComponentClick}
          tabIndex={element.i}
          className={component_className}
          key={element.i}
          data-key={element.i}
        >
          {this.generateElementComponent(element)}
        </div>
      )
    });


    const layout = this.state.layout.map((element, index) => {
      console.log(element)
      return {
        ...element,
        static: !edit_mode,
        isDraggable: edit_mode

      }
    })

    let width = this.state.window_width
    if (!this.state.hide_leftcol) {
      width = width - 240
    }
    if (this.state.dashboard && this.state.dashboard.edit_mode) {
      width = width - 271
    }

    let Grid = (
      <GridLayout
        onLayoutChange={this.onLayoutChange}
        onDrop={this.onElementDrop}
        onDragStop={this.onDragStop}
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={50}
        width={width}
        minH={900}
        verticalCompact={false}
        containerPadding={[20, 20]}
        isDroppable={edit_mode}
        droppingItem={{ i: 'ghost_element', w: 4, h: 2 }}
      >
        {Elements}
      </GridLayout>
    )

    // generating the RightBar component

    let RightBar;
    if (this.state.active_component === null) {
      RightBar = (
        <div className="dashboard-rightbar ">
          <div className="right-sticky-top">
            <input
              type="search"
              value={this.state.component_search}
              onChange={this.onComponentSearch}
              className="input search-input"
              placeholder="Search components"
            />
          </div>
          <div className="side-component-items-container">
            <p className="rightbar-helper-text">Drag an element to the left.</p>
            {RightComponents}
            <p className="rightbar-helper-text delete-dashboard">
              <span onClick={this.showDeleteDashboardModal}
                className="delete-dashboard-span">Delete dashboard</span>
            </p>
          </div>
        </div>
      )
    } else {
      // if the right bar should be the edit bar for a specific element on the dashboard

      // getting the component that this right bar will be for
      let component;
      for (let i = 0; i < this.state.layout.length; i++) {
        if (parseInt(this.state.layout[i].i) === parseInt(this.state.active_component)) {
          component = this.state.layout[i]
          break
        }
      }

      let RightBarInner;

      // generating the options arrays for the selects
      this.variable_options = this.props.variables.map((variable, index) => {
        return {
          ...variable,
          value: variable.key,
          label: variable.name
        }
      })

      this.item_options = this.state.items.map((item, index) => {
        return {
          ...item,
          label: item.name,
          value: item.key
        }
      })

      switch (component.type) {
        case "text":

          RightBarInner = (
            <div className="right-bar-edit-container">
              <p className="right-bar-title">Text block</p>
              <p
                onClick={this.onRemoveActiveComponent}
                className="dashboard-close-rightbar">&lt; Back</p>
              <hr className="hr hr-rightcol" />
              <p className="right-bar-input-header">Value</p>
              <p className="right-bar-input-subheader">Markdown formatting is supported.</p>

              <div className="ace-editor-wrapper">
                <AceEditor
                  mode="handlebars"
                  theme="xcode"
                  wrapEnabled={true}
                  fontSize={13}
                  className="ace-editor"
                  showPrintMargin={false}
                  showGutter={false}
                  highlightActiveLine={true}
                  onChange={this.onTextTextareaChange}
                  value={component.data.text}
                  name="ace-editor"
                  editorProps={{ $blockScrolling: true }}
                  width={"220px"}
                  height={"200px"}
                  styles={{
                    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;",
                  }}
                />
              </div>


              <p className="right-bar-input-header">Variables</p>
              <p className="right-bar-input-subheader">
                Variables let you display metrics in your text block.

                <span
                  onClick={this.onShowCreateVariableModal}
                  className="create-a-variable">Create a variable.</span>
              </p>
              <Select
                onChange={this.onVariableSelectChange}
                value={this.state.selected_variable}
                styles={selectStylesSmall}
                options={this.variable_options} />


              <p className="right-bar-input-header">Text align</p>
              <Select
                onChange={this.onUpdateTextAlign}
                value={component.data.align}
                styles={selectStylesSmall}
                options={text_align_options} />

              <hr className="hr hr-rightcol" />
              <p className="right-bar-input-header">Delete</p>
              <p className="right-bar-input-subheader">Permanently deletes this element.</p>

              <button onClick={this.onDeleteElementClick} data-key={component.i} className="button delete-button rightcol-button">Delete</button>
            </div>
          )
          break
        case "line_chart":
          // if we have to show the right bar for a line chart

          // generating the options array for the active metric selector
          let metric_options = []

          let selected_metrics_key_set = new Set(component.data.selected_metrics.map(metric => metric.key))
          console.log('selected_metrics_key_set')
          console.log(selected_metrics_key_set)
          console.log(this.state.items)
          this.state.items.map((item, index) => {
            console.log(item.data_type)
            if (selected_metrics_key_set.has(item.key)) {
              // if this metric is already selected we ignore it
              return
            } else if (item.data_type !== "NUMBER") {
              // we only allow metrics with a number data type to be added to charts
              return
            }
            metric_options.push({
              ...item,
              label: item.name,
              value: item.key
            })
          })


          const SelectedMetrics = component.data.selected_metrics.map((metric, index) => {
            return (
              <div key={index} className="dashboard-seleted-metrics-container">
                <p className="dashboard-chart-metric-name">{metric.name}</p>
                <p
                  onClick={this.onDeleteChartMetric}
                  data-key={metric.key}
                  className="dashboard-chart-metric-name dashboard-delete-metric">&#10005;</p>
              </div>
            )
          })


          RightBarInner = (
            <div className="right-bar-edit-container">
              <p className="right-bar-title">Line chart</p>
              <p
                onClick={this.onRemoveActiveComponent}
                className="dashboard-close-rightbar">&lt; Back</p>

              <hr className="hr hr-rightcol" />
              <p className="right-bar-input-header">Selected metrics</p>
              <p className="right-bar-input-subheader">
                Add a number-based metric to display on this chart.
                </p>
              {SelectedMetrics}
              <Select
                onChange={this.onChartMetricChange}
                value={null}
                styles={selectStylesSmall}
                options={metric_options} />

              <p className="right-bar-input-subheader">
                {SelectedMetrics.length === 0 ? 'Displaying placeholder data.' : null}
              </p>


              <p className="right-bar-input-header">Days to fetch</p>
              <p className="right-bar-input-subheader">
                The number of past days to display for this chart.
              </p>
              <input
                onChange={this.onChartDaysToFetchChange}
                value={component.data.days_to_fetch}
                placeholder="Enter a number"
                className="input search-input rightbar-input"></input>



              <hr className="hr hr-rightcol" />

              <p className="right-bar-input-header">Chart color</p>
              <CirclePicker
                color={component.data.color}
                onChange={this.onColorPickerChangeComplete}
                circleSize={20}
                circleSpacing={5}
                width={230}
              />

              <p className="right-bar-input-header">Chart title</p>
              <input
                onChange={this.onChartTitleChange}
                value={component.data.chart_title}
                placeholder="Chart title"
                className="input search-input rightbar-input"></input>

              <p className="right-bar-input-header">Chart description</p>
              <input
                onChange={this.onChartDescriptionChange}
                value={component.data.chart_description}
                placeholder="Chart description"
                className="input search-input rightbar-input"></input>

              <p className="right-bar-input-header">Text align</p>
              <Select
                onChange={this.onUpdateTextAlign}
                value={component.data.align}
                styles={selectStylesSmall}
                options={text_align_options} />


              <hr className="hr hr-rightcol" />
              <p className="right-bar-input-subheader">A target line can be used to display a goal.</p>
              <p className="right-bar-input-header">Target label</p>
              <input
                onChange={this.onTargetLineLabelChange}
                value={component.data.chart_target_label}
                placeholder="Target label"
                className="input search-input rightbar-input"></input>
              <p className="right-bar-input-header">Target number</p>
              <input
                onChange={this.onTargetLineValueChange}
                value={component.data.chart_target_value}
                placeholder="Enter a number"
                className="input search-input rightbar-input"></input>


              <hr className="hr hr-rightcol" />
              <p className="right-bar-input-header">Delete</p>
              <p className="right-bar-input-subheader">Permanently deletes this element.</p>

              <button onClick={this.onDeleteElementClick} data-key={component.i} className="button delete-button rightcol-button">Delete</button>
            </div>
          )
          break
        default:
          RightBarInner = null
          break
      }

      RightBar = (
        <div className="dashboard-rightbar ">
          <div className="side-component-items-container">
            {RightBarInner}
          </div>
        </div>
      )
    }

    // generating the item options arrays for the select component
    const item_options = this.state.items.map((item, index) => {
      return {
        ...item,
        value: item.key,
        label: item.name
      }
    })

    let calculation_options = null
    if (this.state.variable_item_select) {
      if (this.state.variable_item_select) {

        switch (this.state.variable_item_select.data_type) {
          case "NUMBER":
            calculation_options = calculation_options_number
            break
          case "BOOLEAN":
            calculation_options = calculation_options_boolean
            break
          case "TEXT":
            calculation_options = calculation_options_text
            break
          case "TIME":
            calculation_options = calculation_options_time
            break
          default:
            calculation_options = []
            break
        }
      }
    }

    let VariableCalcBlock = (
      <div>
        <p className="right-bar-input-header margin-top-10">Calculation</p>
        <p className="right-bar-input-subheader">The type of calculation you would like to perform on the metric.</p>

        <Select
          isDisabled={this.state.variable_item_select === null}
          onChange={this.onVariableCalcSelectChange}
          value={this.state.variable_calc_select}
          styles={selectStylesSmall}
          options={calculation_options} />
      </div>
    )

    let VariableRangeBlock = (
      <div>
        <p className="right-bar-input-header">Days to fetch</p>
        <p className="right-bar-input-subheader">
          Select the number of previous days to fetch.
            </p>
        <input
          disabled={this.state.variable_calc_select === null || !this.state.variable_calc_select.needs_range}
          onChange={this.onDayCountChange}
          value={this.state.day_count}
          type="text"
          inputMode="numeric"
          min="1"
          max="365"
          placeholder="Number of days"
          className="input small-input" />
      </div>
    )


    let VariableNameBlock = (
      <div>
        <p className="right-bar-input-header margin-top-20">Variable name</p>
        <p className="right-bar-input-subheader">Can contain alphanumeric characters, dashes, or underscores.</p>
        <input
          placeholder="Variable name"
          value={this.state.variable_name}
          onChange={this.onVariableNameChange}
          className="input small-input" />
      </div>
    )

    let VariableValidationErrors = this.state.variable_validation_errors.map((error, index) => {
      return <p key={index} className="variable-validation-error">{error}</p>
    })

    let AutosaveMessage = null;
    if (this.state.show_autosave_message) {
      AutosaveMessage = (
        <div className="dashboard-autosave-container">
          <p className="dashboard-autosave-message landing-animate">💾 Super autosaves your work.</p>
        </div>
      )
    }


    let TopBar;
    if (this.state.dashboard) {

      let Button;
      if (this.state.changing_dashboard_visibility) {
        Button = (
          <button
            onClick={this.onToggleDashboardVisibility}
            className="button publish-button">
            <img src={spinner_white} className="publish-spinner" alt="" />
          </button>
        )
      } else if (this.state.dashboard.edit_mode) {
        Button = <button onClick={this.onToggleDashboardVisibility}
          className="button publish-button">Publish</button>
      } else {
        Button = <button
          onClick={this.onToggleDashboardVisibility}
          className="button publish-button edit-button">Edit</button>
      }

      TopBar = (
        <div className="dashboard-topbar">
          <p className="toggle-col" onClick={this.toggleColumn}>
            {this.state.hide_leftcol ? <span>&#8677;</span> : <span>&#8676;</span>}
          </p>
          <p className="topbar-dashboard-name">
            {this.state.dashboard.emoji}&nbsp;
              {this.state.dashboard.name}
          </p>
          <p className="topbar-dashboard-description">
            {this.state.dashboard.description}
          </p>
          {Button}
        </div>
      )
    } else {
      TopBar = <div className="dashboard-topbar"></div>
    }




    return (
      <div className="Container" >
        <Modal
          closeTimeoutMS={100}
          style={modalStyles}
          isOpen={this.state.show_delete_dashboard_modal}
          onRequestClose={this.closeDeleteDashboardModal}
        >
          <p className="modal-p">
            Are you sure you want to permanently delete this dashboard and
           all of its data?
           </p>
          <div className="button-pair-container">
            <button
              onClick={this.closeDeleteDashboardModal}
              className="button edit-item-button cancel-button">Cancel</button>
            <button
              onClick={this.onDeleteDashboardClick}
              className="button edit-item-button delete-button margin-left-20">Delete</button>
          </div>

        </Modal>
        <Modal
          closeTimeoutMS={100}
          style={modalStyles}
          isOpen={this.state.show_variable_modal}
          onRequestClose={this.closeVariableModal}
        >

          <p className="right-bar-input-header">Metric</p>
          <p className="right-bar-input-subheader">The metric you would like to create a variable from.</p>

          <Select
            onChange={this.onVariableItemSelectChange}
            value={this.state.variable_item_select}
            styles={selectStylesSmall}
            options={item_options} />


          {VariableCalcBlock}
          {VariableRangeBlock}
          {VariableNameBlock}
          {VariableValidationErrors}

          {this.state.submitting_variable ?
            <button
              className="button edit-item-button archive-button margin-left-20 create-v-button button-spinner">
              <img alt="" src={spinner_white} className="spinner spinner-small spinner-button" />
            </button>
            :
            <button
              onClick={this.onCreateVariableClick}
              className="button edit-item-button archive-button margin-left-20 create-v-button">Create Variable</button>
          }

        </Modal>

        <LeftColumn
          dashboard_key={dashboard ? dashboard.key : null}
          hidden={this.state.hide_leftcol} />

        <div className="inner-container">
          {TopBar}
          <div className="split-container">
            <div onClick={this.onLayoutClick} id="canvas" className="dashboard-center-canvas">
              {AutosaveMessage}
              {Grid}
            </div>
            {edit_mode ? RightBar : null}
          </div>
        </div >
      </div >
    )

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

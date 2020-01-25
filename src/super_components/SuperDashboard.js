import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';

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
import spinner_black from '../static/images/spinner_black.svg'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { show_app_notification, delete_app_notification, receive_items, set_items_list } from '../actions/actions.js'
import DataInputHome from './DataInputHome'
import { API_URL } from '../index.js';
import NotFound404 from '../404.js'
import LeftColumn from './LeftColumn.js'
import Split from 'react-split'
import GridLayout from 'react-grid-layout';
import ReactMarkdown from 'react-markdown'
import Modal from 'react-modal';
import { selectStyles, selectStylesSmall } from '../styles.js';


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
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '400px',
    minHeight: '600px',
    transform: 'translate(-50%, -50%)'
  }
};


const components = [
  {
    name: 'Text block',
    description: 'A block of text. Good for documenting your dashboard.',
    value: 'text'
  },
  {
    name: 'Table',
    description: 'A table used to display data.',
    value: 'table'
  },
  {
    name: 'Bar chart',
    description: 'Display a bar chart.',
    value: 'bar_chart'
  },
  {
    name: 'Line chart',
    description: 'Display a line chart.',
    value: 'line_chart'
  },
  {
    name: 'Heatmap',
    description: 'Useful for displaying daily numeric data.',
    value: 'heatmap'
  },
]


class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
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
      show_variable_modal: true,
      variable_item_select: null,
      variable_calc_select: null
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
  }

  onCreateVariableClick(e) {
    console.log('create variable click')


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

  onTextTextareaChange(e) {

    // event handler for when when a text element's text area is changed
    let key = parseInt(e.currentTarget.dataset.key)



    // creating a new layout array
    let layout_clone = JSON.parse(JSON.stringify(this.state.layout))

    let new_layout = []
    layout_clone.map((element, index) => {
      if (parseInt(element.i) === key) {

        new_layout.push({
          ...element,
          data: {
            ...element.data,
            text: e.target.value
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
    // we clear the active element when the escape button is pressed

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
    console.log('LAYOUT CHANGE:')
    // callback for when the layout changes so we can update state

    let new_layout = []
    for (let i = 0; i < layout.length; i++) {
      if (layout[i].i === "ghost_element") {
        console.log('skip ghost element')
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
        console.log(layout[i])

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
        return (
          <div className="db-component">
            <ReactMarkdown source={element.data.text} />
          </div>
        )
      case "number":
        return (
          <div className="db-component">
            <div className="db-number">47</div>
            <div className="db-number-text">Click to edit</div>
          </div>
        )
        break
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
      // default:
      //   HTML = "Error"
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
      i: `${new_key}`,
      type: this.state.type_being_dragged,
      data: {
        text: "Click to edit"
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

    if (prevProps.match.params.key !== this.props.match.params.key) {
      this.setState({ key: this.props.match.params.key })
    }
  }

  componentDidMount() {

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


    let canvas = document.getElementById('canvas')
    if (canvas) {


    }

    // handling the escape button
    window.addEventListener('keydown', this.onEscapeKeydown);

  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscapeKeydown);
  }


  render() {

    let dashboard = null



    // showing a spinner if the dashboards list hasn't been populated yet
    if (this.props.dashboards == null) {
      return (
        <div className="Container">
          <LeftColumn />

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
          <LeftColumn />

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
            <LeftColumn />

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
            draggable={true}
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
      return (
        <div
          onClick={this.onComponentClick}
          tabIndex={element.i}
          className={this.state.active_component === parseInt(element.i) ? "component-wrapper active-component" : "component-wrapper"}
          key={element.i}
          data-key={element.i}
        >
          {this.generateElementComponent(element)}
        </div>
      )
    });

    let Grid = (
      <GridLayout
        onLayoutChange={this.onLayoutChange}
        onDrop={this.onElementDrop}
        onDragStop={this.onDragStop}
        className="layout"
        layout={this.state.layout}
        cols={12}
        rowHeight={50}
        width={900}
        minH={900}
        verticalCompact={false}
        containerPadding={[10, 10]}
        isDroppable={true}
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

      switch (component.type) {
        case "text":

          // generating the options arrays for the selects
          const variable_options = this.state.variables.map((variable, index) => {
            return {
              value: variable.key,
              label: variable.name
            }
          })

          RightBarInner = (
            <div className="right-bar-edit-container">
              <p className="right-bar-title">Text block</p>
              <p className="right-bar-input-header">Value</p>
              <p className="right-bar-input-subheader">Markdown formatting is supported.</p>
              <textarea
                data-key={component.i}
                onChange={this.onTextTextareaChange}
                value={component.data.text}
                placeholder="Enter text"
                className="input rightbar-textarea" />

              <p className="right-bar-input-header">Variables</p>
              <p className="right-bar-input-subheader">
                Variables let you put data in your text block.

                <span
                  onClick={this.onShowCreateVariableModal}
                  className="create-a-variable">Create a variable.</span>
              </p>
              <Select
                onChange={null}
                value={null}
                styles={selectStylesSmall}
                options={variable_options} />
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



    let VariableRangeBlock = null;

    if (this.state.variable_calc_select && this.state.variable_calc_select.needs_range) {

      // if we only want to fetch the entry for a single date
      if (this.state.variable_item_select.value === 'specific_entry') {
        VariableRangeBlock = (
          <div>
            <p className="right-bar-input-header">Days to fetch</p>
            <p className="right-bar-input-subheader">
              Select the number of past days to fetch.
              Value should be between 1 - 365 days.
            </p>
            <input
              type="text"
              inputMode="numeric"
              min="1"
              max="365"
              placeholder="Number of days"
              className="input small-input" />
          </div>
        )
      } else {
        VariableRangeBlock = (
          <div>
            <p className="right-bar-input-header">Days to fetch</p>
            <p className="right-bar-input-subheader">
              Select the number of past days to fetch.
              Value should be between 1 - 365 days.
          </p>
            <input
              type="text"
              inputMode="numeric"
              min="1"
              max="365"
              placeholder="Number of days"
              className="input small-input" />
          </div>
        )
      }

    }

    return (
      < div className="Container" >
        <Modal
          closeTimeoutMS={100}
          style={modalStyles}
          isOpen={this.state.show_variable_modal}
          onRequestClose={this.closeVariableModal}
        >

          <p className="right-bar-input-header">Item</p>
          <p className="right-bar-input-subheader">The item you would like to create a variable from.</p>

          <Select
            onChange={this.onVariableItemSelectChange}
            value={this.state.variable_item_select}
            styles={selectStylesSmall}
            options={item_options} />

          <p className="right-bar-input-header margin-top-10">Calculation</p>
          <p className="right-bar-input-subheader">The type of calculation you would like to perform on the item.</p>

          <Select
            onChange={this.onVariableCalcSelectChange}
            value={this.state.variable_calc_select}
            styles={selectStylesSmall}
            options={calculation_options} />

          {VariableRangeBlock}

          <p className="right-bar-input-header margin-top-20">Variable name</p>
          <p className="right-bar-input-subheader">Give your variable an informative name.</p>
          <input
            placeholder="Variable name"
            className="input small-input" />

          <button
            onClick={this.onCreateVariableClick}
            className="button edit-item-button archive-button margin-left-20 create-v-button">Create Variable</button>
        </Modal>

        <LeftColumn hidden={this.state.hide_leftcol} />


        <div className="inner-container">
          <div className="dashboard-topbar">
            <p className="toggle-col" onClick={this.toggleColumn}>
              {this.state.hide_leftcol ? <span>&#8677;</span> : <span>&#8676;</span>}
            </p>
          </div>


          <div className="split-container">

            <div onClick={this.onLayoutClick} id="canvas" className="dashboard-center-canvas ">
              {Grid}
            </div>


            {RightBar}

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
    items: state.items
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    delete_app_notification,
    receive_items,
    set_items_list,
    show_app_notification
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

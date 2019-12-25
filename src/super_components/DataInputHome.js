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
import spinner_black from '../static/images/spinner_black.svg'
import spinner from '../static/images/spinner.svg'
import TimeKeeper from 'react-timekeeper';
import LandingPage from '../LandingPage.js';
import logo_white from '../static/images/logos/super-logo-white.png';
import logo_black from '../static/images/logos/super-logo-black.png';
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import TimePicker from 'rc-time-picker';
import svg1 from '../static/images/undraw_blooming_jtv6.svg';
import { ToastContainer, toast } from 'react-toastify';
import home from '../static/images/home.svg';
import messages from '../static/images/support.svg';
import security from '../static/images/lock.svg';
import settings from '../static/images/settings.svg';

import hamburger_black from '../static/images/hamburger_black.svg'
import {fake_data} from '../fake_data.js'
import CreateItem from '../CreateItem'

import { Link } from 'react-router-dom';

import {selectStyles} from '../styles.js';
import { createStore, bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {
  set_user_details,
  receive_login_response,
  receive_items,
  set_items_list,
  show_app_notification,
  clear_receive_items,
  update_dates_dict,
  update_working_dates_dict
} from "../actions/actions.js";

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

const time_options = [
  { label: 'Seconds', value: 'seconds'},
  { label: 'Minutes', value: 'minutes'},
  { label: 'Hours', value: 'hours'},
  { label: 'Days', value: 'days'},
  { label: 'Weeks', value: 'weeks'},
  { label: 'Months', value: 'months'},
  { label: 'Years', value: 'years'}
]


const boolean_options = [
  { label: 'No', value: 'false'},
  { label: 'Yes', value: 'true'}
]



function get_placeholder_val(data_type) {
  // returns a placeholder value for a given data type
  // possible data types are:
  // NUMBER, BOOLEAN, TEXT, TIME, TIME_DURATION
  switch(data_type) {
    case 'NUMBER':
      return "Enter a number"
    case 'BOOLEAN':
      return null
    case 'TEXT':
      return "Enter text"
    case 'TIME':
      return null
    case 'TIME_DURATION':
      return "Enter a number"
    default:
      return null
  }
}

function generate_field(data_type, onFieldChange, value, data_index = null, custom_index = null) {
  // data_type: the type of field
  // onFieldChange: the event handler
  // the value for this field
  // data_index: this field's item index
  // custom_index: this field's custom_field index (null if not a custom field)

  function handleChange(e, index, custom_index = null) {
    onFieldChange(index, custom_index, e);
  }

  switch(data_type) {
    case 'NUMBER':
      return (
        <input
        inputMode="numeric"
        id="numinput"
        type="text"
        data-index={data_index}
        value={value}
        onChange={e => handleChange(e, data_index, custom_index)}
        placeholder={get_placeholder_val(data_type)}
        className="input"></input>
      )
    case 'BOOLEAN':

    return (
      <Select
      data-index={data_index}
      value={value}
      onChange={e => handleChange(e, data_index, custom_index)}
      styles={selectStyles}
      options={boolean_options} />
    )
    case 'TEXT':

    return (
      <textarea
      data-index={data_index}
      value={value}
      onChange={e => handleChange(e, data_index, custom_index)}
      placeholder={get_placeholder_val(data_type)}
      className="input textarea"></textarea>
    )
    case 'TIME':

      // we cannot pass an empty string to the timepicker's value
      value = value === "" ? null : value

      return (
        <TimePicker
          data-index={data_index}
          value={value}
          onChange={e => handleChange(e, data_index, custom_index)}
          showSecond={false}
          className="timepicker-style"
          format="h:mm a"
          use12Hours
          inputReadOnly
          />
      )
    case 'TIME_DURATION':
    return (
      <div>
      <div className="create-item-time-duration-container">
        <input
        type="text"
        inputMode="numerical"
        data-index={data_index}
        value={value.value ? value.value : ""}
        onChange={e => handleChange(e, data_index, custom_index)}
        placeholder={get_placeholder_val(data_type)}
        className="input time-duration-input" />
        <Select
        data-index={data_index}
        value={value.unit}
        onChange={e => handleChange(e, data_index, custom_index)}
        className="time-duration-selector"
        styles={selectStyles}
        options={time_options} />
      </div>
      </div>
    )
    default:
      return null
  }
}

class DataInputHome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      saving: false,
    }

    this.onDateArrowClick = this.onDateArrowClick.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onDateClick = this.onDateClick.bind(this);
    this.fetchDataForDate = this.fetchDataForDate.bind(this);
    
    // ahh, so what I think is happening is that we're getting items from a network request
    // and then we're parsing the empty items array
    // and then the items arary is populated once the network request returns
    // but the constructor is called before items gets populated, so working_items is empty
    // to fix this, we need to only populate working items once it has been returned
    // if it has not been returned, we must display a spinner
    // what if we don't store it in state, but instead use redux to store it?
    // im curious if it would be better to store working_items in redux, and then use actions to update it
    // what would be the downsides? it would be more complicated than storing it in class state,
    // but it would fix the issue where working_items gets created with no state
    // it would also be easy to update working_items whenever items gets changed from the network
    // we would simply copy items to working_items whenever we set a new items array

  }

  onSaveButtonClick(e) {
    // when the Save button is pressed
    e.preventDefault()

    if (this.state.saving) {
      return
    } else {
      this.setState({saving: true})
    }

    // POSTing the items to the endpoint
    // TODO: you need to grab the items from the working items array
    // and overwrite it to the items array
    // then post that items array
    let data = {
      items: this.props.working_items,
      date: this.state.date
    }

    // now that the save button is pressed, we must copy the working items list back over to the items list
    this.props.set_items_list(this.props.working_items)

    axios.post(`${API_URL}/api/items/create-item-entry/`, data)
      .then(res => {
        // creating a message to show in the main app
        this.props.show_app_notification("Your day has been saved")

        // clearing the items list so it can be refreshed
        // this.props.clear_receive_items()


        this.setState({saving: false})
        console.log(res.data)
        this.setState({redirect_to_app: true})
        // if there was an error, we display it in a notification
        if (res.data && res.data.error) {
          toast.error(res.data.error);
        } else {
        }
      })
      .catch((err, res) => {
        this.setState({saving: false})
        console.log(err, res)
      });
  }

  onFieldChange(index, custom_index, e) {
    // when a field changes, we must update the working_items dict
    // the items dict will remain unchanged until the user saves

    // getting this Item's index
    let item_index = parseInt(index)

    // recreating the items array
    let items = this.props.working_items.map((item, index) => {

      // we ignore non-matching items
      if (item_index !== index) {
        return item
      }

      // if this is a custom item, we must recreate the custom_fields array
      if (custom_index !== null) {
        let new_custom_fields = this.props.working_items[index].custom_fields.map((field, index2) => {
          // we ignore all custom fields except for the one matching custom_index
          if (index2 !== custom_index) {
            return field
          }
          let value = null;
          switch(field.field_type) {
            case 'NUMBER':
              if (/^\d+$/.test(e.target.value) || e.target.value === "") {
                value = e.target.value
              } else {
                value = field.value
              }
              break
            case 'BOOLEAN':
              value = e
              break
            case 'TEXT':
              value = e.target.value
              break
            case 'TIME':
              value = e
              break
            case 'TIME_DURATION':
              // this is a special case because a time duration field is technically two fields
              // we have an integer field as well as a unit of time field (an object in time_options)
              if (e.target) {
                // if there's a target, then this is the integer field
                // validating the integer
                if (/^\d+$/.test(e.target.value) || e.target.value === "") {
                  // if the integer is valid, we set it as the value field
                  value = {
                    value: e.target.value,
                    unit: field.value.unit
                  }
                } else {
                  // if the integer is invalid, we use the previous integer value
                  value = {
                    value: field.value.value,
                    unit: field.value.unit
                  }
                }

              } else {
                // otherwise it's the react-select unit of time field
                value = {
                  unit: e,
                  value: field.value.value
                }
              }
              break
            default:
              return field
          }

          // now we set the value
          return {
            ...field,
            value: value
          }
        });
        return {
          ...item,
          custom_fields: new_custom_fields
        }
      } else {

        // now we determine what the data type is
        let value = null;
        switch(item.data_type) {
          case 'NUMBER':
            if (/^\d+$/.test(e.target.value) || e.target.value === "") {
              value = e.target.value
            } else {
              value = item.value
            }
            break
          case 'BOOLEAN':
            value = e
            break
          case 'TEXT':
            value = e.target.value
            break
          case 'TIME':
            value = e
            break
          case 'TIME_DURATION':
            // this is a special case because a time duration field is technically two fields
            // we have an integer field as well as a unit of time field (an object in time_options)
            if (e.target) {
              // if there's a target, then this is the integer field
              // validating the integer
              if (/^\d+$/.test(e.target.value) || e.target.value === "") {
                // if the integer is valid, we set it as the value field
                value = {
                  value: e.target.value,
                  unit: item.value.unit
                }
              } else {
                // if the integer is invalid, we use the previous integer value
                value = {
                  value: item.value.value,
                  unit: item.value.unit
                }
              }

            } else {
              // otherwise it's the react-select unit of time field
              value = {
                unit: e,
                value: item.value.value
              }
            }
            break
          default:
            return null
        }

        // updating this item's value
        return {
          ...item,
          value: value
        }

      }
    });

    // now that we have an updated working_items dict
    // we must update the working_items state in the redux store
    // this.props.set_working_items_list(items)
    
    
    // TODO: you need to update the working dates dict
    console.log("updating the working dates dict")
    console.log(items)
  }

  onDateArrowClick(e) {
    const orientation = e.currentTarget.dataset.orientation
    let new_date;
    if (orientation === "right") {
      new_date = this.state.date.add(1, 'days')
    } else if (orientation === "left") {
      new_date = this.state.date.subtract(1, 'days')
    }
    this.setState({date: new_date})
  }

  onDateClick(e) {
    console.log(this.props.dates)
    // updates the date in state when a new date is clicked
    console.log(e.currentTarget.dataset)

    let offset = parseInt(e.currentTarget.dataset.offset)
    let new_date = moment(this.state.date).add(offset, 'days')
    this.setState({
      date: new_date
    })
    
  }

  componentDidMount() {
    // we need to make the initial fetch
    this.fetchDataForDate(this.state.date)
  }

  fetchDataForDate(date) {
    /*

    Whenever a user brings a date into view, we must pass it to this function to ensure
    we have the relevant date data. If the date data for the current date is already present
    in the date dict, then this function will ensure the surrounding dates have been fetched.
    This prevents the user from having to wait for days to be fetched while navigating through their dates.

    The dates we check and the dates we check should be different. We should verify a smaller range
    of dates exist in the dict, and fetch a larger range. This will prevent the client from fetching
    new dates every time the date is changed. For example, we fetch nothing if the 30 days surrounding 
    a date exist in the dict, but if a date is missing we fetch the 90 days surrounding a fetch.

    This means there is 2 months of browsing without requiring a fetch.
    The exact values to fetch can be changed.


    I feel like this is over-engineering? Or maybe I'm just lazy. But it's good to be lazy xD.


    */

    // the date range to initially fetch in days
    const INITIAL_FETCH_PAST = 3
    const INITIAL_FETCH_FUTURE = 1

    // the dates range relative to the current date to check
    const CHECK_FUTURE_DATES = 10
    const CHECK_PAST_DATES = 20

    // the date range relative to the current date to fetch from the API endpoint
    const FETCH_PAST_DATES = 90
    const FETCH_FUTURE_DATES = 30

    let dates = this.props.dates;
    let data;
    
    if (!(date.format('DD-MM-YYYY') in dates)) {
      // if the dates dict is empty, then we we must make the initial fetch
      data = {
        start_date: moment(date).subtract(INITIAL_FETCH_PAST, 'days'),
        end_date: moment(date).add(INITIAL_FETCH_FUTURE, 'days')
      }

    } else {
      // if the current date has already been fetched, then we simply check whether we need to 
      // fetch the surrounding dates.
      // 
      // TODO: we can check the dates dict later to validate whether we actually need to fetch
      // in the meanwhile, let's just fetch anyways
      // data = {
      //   start_date: moment(date).subtract(FETCH_PAST_DATES, 'days'),
      //   end_date: moment(date).add(FETCH_FUTURE_DATES, 'days')
      // }
    }

    if (!data) {
      // if the POST data dict is empty, then we don't need to fetch anything
      return;
    }
    
    // making a request to update the dates dict
    axios.post(`${API_URL}/api/items/get/`, data, {withContext: true}).then(res => {
      // once we receieve the dates dict, we pass update the global redux date dict
      // this will cause a re-render since it's updating the global state
      // and we used connect() to map global state to local props
      console.log(res.data)
      this.props.update_dates_dict(res.data)

    }).catch(err => {
      console.log(err)
    });
  }

  render() {

    // calculating the dates
    let nav_dates = [
      moment(this.state.date).add(-3, "days"),
      moment(this.state.date).add(-2, "days"),
      moment(this.state.date).add(-1, "days"),
      moment(this.state.date).add(0, "days"),
      moment(this.state.date).add(1, "days"),
      moment(this.state.date).add(2, "days"),
      moment(this.state.date).add(3, "days"),
    ]
    // building the top date selector
    let NavDates = nav_dates.map((date, index) => {
        if (index === 3) {
          // if this is the middle date (the user's current seleted date)
          return (
            <div onClick={this.onDateClick} key={index} data-offset={index - 3} className="date-item center-date">
              <h1 className="main-date current-date-main">{date.format('dddd')}</h1>
              <p className="sub-date current-date-sub">{date.format('MMMM Do')}</p>
            </div>
          )
        } else {
          // if this is any other date, we must change the styling to be greyed out
          // first, we check if this date is today
          // if it's today, then we must indicate to the user by adding a background color
          return (
            <div onClick={this.onDateClick} key={index} data-offset={index - 3} 
            className={(moment(date).isSame(moment(), 'day')) ? "date-item center-date today-date" : "date-item center-date"}
            >
              <h1 className="main-date">{date.format('dddd')}</h1>
              <p className="sub-date">{date.format('MMMM Do')}</p>
            </div>
          )
        }
    });

    // formatting the current date to match the format of the key in redux's date dict
    let current_date = this.state.date.format('DD-MM-YYYY')

    if (!(current_date in this.props.dates)) {
      // if the current date is not in the date's dict
      // then we must display a spinner and then request the date
      console.log('requested date ' + current_date + ' not in dates dict')

      // we just render a spinner if we have yet to fetch the values for this date
      return (
        <div className="main-message-box full-width-box middle-container-standard">
          <div className="inner-text grey-border-bottom data-input-header-container">
            <div data-orientation="left" onClick={this.onDateArrowClick} className="arrow date-arrow-left">&#8592;</div>
            <div data-orientation="right" onClick={this.onDateArrowClick} className="arrow date-arrow-right">&#8594;</div>
            <div className="dates-flexbox">{NavDates}</div>
          </div>
          <div className="inner-text grey-bg">
          <img className="spinner spinner-content" src={spinner_black} alt=""/>
          </div>
        </div>
      )
    }

    // getting this date's items from the global dates dict
    // we can now proceed to render the items, as well as working items (items without a user value yet)
    // current items is a list of items that we should render for this specific day
    const current_items = this.props.dates[current_date]

    let ItemRows;
    let SavedRows;


    // if there are no current items for this day
    // we simply display no current items and a link to the create page
    if (current_items.length === 0) {
      return (
        <div className="main-message-box full-width-box middle-container-standard">
          <div className="inner-text grey-border-bottom data-input-header-container">
            <div data-orientation="left" onClick={this.onDateArrowClick} className="arrow date-arrow-left">&#8592;</div>
            <div data-orientation="right" onClick={this.onDateArrowClick} className="arrow date-arrow-right">&#8594;</div>
            <div className="dates-flexbox">{NavDates}</div>
          </div>
          <div className="inner-text grey-bg">
          <p className="item-header">
          No tracked items for today. <a href="/create">Create a new item.</a>
          </p>
          </div>
        </div>
      )
    }

    // generating the saved rows that appear for items that already have a value
    // todo: don't use filter(), just use map() and return null for items you'd like to skip
    // SavedRows are items that the user has already inputted a value for.
    // We still need to render them in case I want to update a value that I already saved
    // For example: retroactively update a boolean field for a previous day
    SavedRows = current_items.map((item, index1) => {

      // we must skip any items that don't have a saved value by returning null
      // we can check if an item do
      if (item.data_type === 'CUSTOM') {
        // an item is a saved item if 
        for (var i = 0; i < item.custom_fields.length; i++) {
          let val = item.custom_fields[i].value
          if (val === "" || val == null) {
            return null
          }
        }
      } else {
        if (item.value === "" || item.value == null) {
          return null
        }
      }
      return <div key={index1}>{item.name}: {item.value.value}</div>
    });

    if (SavedRows.length === 0) {
      console.log("Saved Rows:")
      console.log(SavedRows)
      SavedRows = <p>No items saved for today.</p>
    }

    console.log(this.props.working_dates)

    ItemRows = current_items.map((item, index1) => {
      console.log(item)
      // we must skip any items that don't have a saved value
      if (item.data_type === 'CUSTOM') {
        for (var i = 0; i < item.custom_fields.length; i++) {
          let val = item.custom_fields[i].value
          if (val !== "" && val != null) {
            return null
          }
        }
      } else {
        if (item.value !== "" && item.value != null) {
          return null
        }
      }

      if (item.data_type === 'CUSTOM') {
        let CustomFields = item.custom_fields.map((field, index2) => {
          
          // we use items[] for everything, except when we render a value,
          // we use the value present in working_items[]
          let working_field = this.props.working_items[index2]
          return (
            <div key={index2}>
            <div className="data-input-row">
            <p className="item-option-header-small item-left-field">{field.name}</p>
              <div className="item-right-input">
                {generate_field(field.field_type, this.onFieldChange, working_field.value, index1, index2)}
              </div>
            </div>
            </div>
          )
        })

        return (
          <div key={index1}>
            <p className="">{item.name}</p>
            <div key={index1} className="custom-item-input-container">
              {CustomFields}
            </div>
          </div>
        )
      }

      // for non-custom fields we simply render the field
      let working_field = this.props.working_dates[current_date][index1]
      return (
        <div key={index1}>
        <div className="data-input-row non-custom-item-input-container">
        <p className="data-input-name item-option-header-small">{item.name}</p>
          <div className="data-input-input">
            {generate_field(item.data_type, this.onFieldChange, working_field.value, index1)}
          </div>
        </div>
        </div>
      )
    })

    let SaveButton = (
      <button onClick={this.onSaveButtonClick} className="button create-item-button save-day-btn">
        {this.state.saving ? <img className="small-spinner" src={spinner} alt="" /> : "Save Day"}
      </button>
    )

    let GetStarted = (
      <p key="no-items" className="item-header">To get started with Super, <Link to="/create">Create an item.</Link></p>
    )

    let Spinner = (
      <img key="spinner" className="spinner spinner-content" src={spinner_black} alt=""/>
    )
    

    let GreyBox = (
      <div key="items" className="data-input-form-container">
      {ItemRows}
      {SaveButton}
      <h4>Today's summary</h4>
      <hr/>
      {SavedRows}
      </div>
    )
    
    // returning the values
    return (
      <div className="main-message-box full-width-box middle-container-standard">

        <div className="inner-text grey-border-bottom data-input-header-container">
            <div data-orientation="left" onClick={this.onDateArrowClick} className="arrow date-arrow-left">&#8592;</div>
            <div data-orientation="right" onClick={this.onDateArrowClick} className="arrow date-arrow-right">&#8594;</div>
            <div className="dates-flexbox">{NavDates}</div>
          </div>
        <div className="inner-text grey-bg">
        {GreyBox}
        </div>
      </div>

    )
  }
}


// this function maps the redux state to props this component can access
const mapStateToProps = state => {
  return {
    login_response_received: state.login_response_received,
    user: state.user,
    items_received: state.items_received,
    items: state.items,
    schema: state.schema,
    working_items: state.working_items,
    dates: state.dates,
    working_dates: state.working_dates
  }
}
// the action creators this component should have access to

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    set_user_details,
    receive_login_response,
    show_app_notification,
    clear_receive_items,
    update_dates_dict
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(DataInputHome);

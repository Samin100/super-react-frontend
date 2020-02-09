import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../App.css';
import '../Super.css';
import axios from 'axios';
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
import spinner from '../static/images/spinner.svg'
import list from '../static/images/list.svg';
import hamburger_black from '../static/images/hamburger_black.svg'


import Timekeeper from 'react-timekeeper';
import TimePicker from 'rc-time-picker';
import { selectStyles } from '../styles.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { show_app_notification, update_dates_dict, clear_dates_dict, set_user_details } from '../actions/actions.js'
import { API_URL } from '../index.js';
import LeftColumn from './LeftColumn.js'

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



class SuperCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      redirect_to_app: false,
      item_type: 'optimization',
      item_name: "",
      main_data_type: data_options[0],
      frequency: { label: 'Daily', value: 'daily' },
      custom_fields: [{
        field_name: "",
        data_type: data_options_no_custom[0]
      }],
      target_value: "",
      target_time: null,
      target_field: null,
      target_value_duration_unit: { label: 'Minutes', value: 'minutes' },
      error_messages: [
      ]
    }

    this.onLoggingClick = this.onLoggingClick.bind(this);
    this.onOptimizationClick = this.onOptimizationClick.bind(this);
    this.onItemNameChange = this.onItemNameChange.bind(this);
    this.onDataTypeChange = this.onDataTypeChange.bind(this);
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
    this.onAddFieldClick = this.onAddFieldClick.bind(this);
    this.onCustomFieldNameChange = this.onCustomFieldNameChange.bind(this);
    this.onDeleteCustomField = this.onDeleteCustomField.bind(this);
    this.onCustomFieldDataTypeChange = this.onCustomFieldDataTypeChange.bind(this);
    this.onCreateItemClick = this.onCreateItemClick.bind(this);
    this.onTargetFieldChange = this.onTargetFieldChange.bind(this);
    this.onTargetValueChange = this.onTargetValueChange.bind(this);
    this.onTargetValueDurationUnitChange = this.onTargetValueDurationUnitChange.bind(this);
    this.onReplayOnboardingClick = this.onReplayOnboardingClick.bind(this);

  }

  onReplayOnboardingClick(e) {
    axios.post(`${API_URL}/api/onboarding/set-step/`, { step: 1 }).then(res => {
      // we must redirect the user to the proper page now
      // we do this by fetching a new user object
      // and updating props accordingly
      // we get the new user object and then update redux state
      // then we redirect to the new page
      axios.get(`${API_URL}/api/auth/status/`, { withContext: true }).then(res => {
        // delaying updating the props by 2 seconds so the user has time to read the last message
        this.props.set_user_details(res.data)
        this.setState({ redirect_to_app: true })

        // then we redirect to the new page
      }).catch(err => {
        console.log(err)
      });

    }).catch((error) => {
      console.log(error)
    })
  }



  onCreateItemClick(e) {

    if (this.state.submitting) {
      return
    }

    let error_messages = []

    // checking if the item type is valid
    if (this.state.item_type !== 'optimization' && this.state.item_type !== 'logging') {
      error_messages.push('Please select either active optimization or passive logging.')
    }
    // checking if the item name is valid
    if (!/\S/.test(this.state.item_name)) {
      error_messages.push("Please enter a valid metric name.")
    }
    // checking if the data type is valid
    if (this.state.main_data_type == null) {
      error_messages.push("Please select a valid data type.")
    }
    // checking if the frequency is valid
    if (this.state.frequency == null) {
      error_messages.push("Please select a valid frequency.")
    }

    if (this.state.item_type === 'optimization') {

      let data_type;
      let target_val = this.state.target_value
      if (this.state.main_data_type.value === 'custom') {

        // checking if every custom field is a valid string
        for (var i = 0; i < this.state.custom_fields.length; i++) {
          if (!/\S/.test(this.state.custom_fields[i].field_name)) {
            error_messages.push("Every custom field must have a valid name.")
            break
          }
        }

        // checking if the target field is provided
        // and the target field string matches the custom field string
        if (this.state.target_field == null ||
          this.state.target_field.label !== this.state.custom_fields[this.state.target_field.value].field_name) {
          error_messages.push("Please select a valid target field.")
        }

        // the data type is the field type of the target field
        if (this.state.target_field) {
          data_type = this.state.custom_fields[this.state.target_field.value].data_type.value
        }


      } else {
        // the data type is simply the main_data_type
        data_type = this.state.main_data_type.value
      }

      // we only generate target value errors if a target field has been chosen
      if (data_type) {
        if (data_type === 'number' && !/^\d+$/.test(target_val)) {
          error_messages.push("Target value must be a number.")
        } else if (data_type === 'boolean' && (target_val == null || target_val === "")) {
          error_messages.push("Please select a target value of True or False.")
        } else if (data_type === 'time' && (this.state.target_time == null || this.state.target_time === "")) {
          console.log(target_val)
          error_messages.push("Please select a valid time for your target value.")
        } else if (data_type === 'time_duration' && (!/^\d+$/.test(target_val) || this.state.target_value_duration_unit == null)) {
          error_messages.push("Please select a valid time duration for your target value.")
        }
      }

    }

    // we reset the error_messages list
    // then we return if it contained at least one error
    this.setState({ error_messages: error_messages })
    if (error_messages.length > 0) {
      return
    }

    // if there were no messages, we can POST the data to the create item endpoint
    let data = this.state

    this.setState({ submitting: true })
    axios.post(`${API_URL}/api/items/create/`, data)
      .then(res => {
        // creating a message to show in the main app
        this.props.show_app_notification("Successfully created a new item.")

        // clearing the dates dict so it can be reloaded
        this.props.clear_dates_dict()


        this.setState({ submitting: false })
        console.log(res.data)
        this.setState({ redirect_to_app: true })
        // if there was an error, we display it in a notification
        if (res.data && res.data.error) {
          toast.error(res.data.error);
        } else {
        }
      })
      .catch((err, res) => {
        this.setState({ submitting: false })
        console.log(err, res)
      });


  }

  onFrequencyChange(e) {
    this.setState({ frequency: e })
  }

  onTargetValueDurationUnitChange(e) {
    // used for the time duration unit selector when optimizing a time duration data type
    this.setState({ target_value_duration_unit: e })
  }

  onTargetValueChange(e) {

    // getting the target field data type
    let target_data_type = null
    if (this.state.main_data_type.value === 'custom') {
      target_data_type = this.state.custom_fields[this.state.target_field.value].data_type.value
      console.log('updating a custom target field value')
    } else {
      target_data_type = this.state.main_data_type.value
      console.log('updating a non-custom target field value')
    }
    console.log('target data type: ' + target_data_type)
    switch (target_data_type) {
      case 'number':
        // if the string is a number or an empty string, we update it
        // the number data type only allows numbers
        if (/^\d+$/.test(e.target.value) || e.target.value === "") {
          this.setState({ target_value: e.target.value })
        }
        break
      case 'boolean':
        this.setState({ target_value: e })
        break
      case 'text':
        // text fields cannot be optimized
        break
      case 'time':
        this.setState({ target_time: e })
        break
      case 'time_duration':
        // if the string is a number or an empty string, we update it
        // the number data type only allows numbers
        if (/^\d+$/.test(e.target.value) || e.target.value === "") {
          this.setState({ target_value: e.target.value })
        }
        break

      default:
        break
    }

  }


  onTargetFieldChange(e) {
    if (this.state.target_field !== e) {
      this.setState({ target_value: "" })
    }
    this.setState({ target_field: e })
  }

  onCustomFieldDataTypeChange(field_index, event) {
    let custom_fields = this.state.custom_fields.map((field, index) => {

      // we must clear the target value if the target field's data type changes
      if (this.state.target_field &&
        this.state.target_field.value === field_index &&
        field.data_type.value !== event.value) {
        this.setState({ target_value: "" })
      }

      return field_index === index ? { ...field, data_type: event } : field
    });

    this.setState({ custom_fields: custom_fields })
  }

  onDeleteCustomField(e) {
    let field_index = parseInt(e.target.dataset.index)

    if (this.state.custom_fields.length === 1) {
      // there should always be at least one custom field
      return
    }

    let custom_fields = [...this.state.custom_fields]
    custom_fields.splice(field_index, 1)
    this.setState({ custom_fields: custom_fields })

  }

  onDataTypeChange(e) {
    console.log(e)
    this.setState({ main_data_type: e, target_value: "" })
  }

  onItemNameChange(e) {
    this.setState({ item_name: e.target.value })
  }

  onLoggingClick(e) {

    if (this.state.item_type !== 'logging') {
      this.setState({ frequency: { label: 'Daily', value: 'daily' } })
    }
    this.setState({ item_type: 'logging' })
  }

  onOptimizationClick(e) {
    if (this.state.item_type !== 'optimization') {
      this.setState({ frequency: { label: 'Daily', value: 'daily' } })
    }
    this.setState({ item_type: 'optimization' })
  }

  onAddFieldClick(e) {
    let custom_fields = this.state.custom_fields.concat({
      field_name: "",
      data_type: data_options[0]
    })
    this.setState({ custom_fields: custom_fields })

  }

  componentDidMount() {

  }

  onCustomFieldNameChange(e) {
    let field_index = parseInt(e.target.dataset.index)
    let custom_fields = this.state.custom_fields.map((field, index) => {
      return field_index === index ? { ...field, field_name: e.target.value } : field
    });

    this.setState({ custom_fields: custom_fields })
  }


  render() {

    if (this.state.redirect_to_app) {
      return <Redirect to="/" />
    }

    let CustomObject = null;

    // generating the Create error messages
    let ErrorMessages = null
    if (this.state.error_messages.length > 0) {
      ErrorMessages = this.state.error_messages.map((error, index) => {
        return <p key={index} className="create-error-message">{error}</p>
      })
    }


    if (this.state.main_data_type.value === 'custom') {
      // if the data type is set to custom, we must show a component containing
      // all the custom fields (CustomObject)
      const CustomFields = this.state.custom_fields.map((field, index) => {

        // defining an arrow function that lets us pass a <Select /> element's index
        // to the event handler this.onCustomFieldDataTypeChange
        const handleChange = index => event => {
          this.onCustomFieldDataTypeChange(index, event);
        };

        return (
          <div key={index} className="object-field-row">
            <div className="object-field-left">
              <input
                data-index={index}
                value={field.field_name}
                onChange={this.onCustomFieldNameChange}
                className="input "></input>
            </div>
            <div className="object-field-right">
              <Select
                onChange={handleChange(index)}
                data-index={index}
                value={field.data_type}
                styles={selectStyles}
                options={data_options_no_custom} />
            </div>
            {index === 0 ? null :
              <p className="delete-field-p">
                <span onClick={this.onDeleteCustomField} data-index={index} className="delete-field-span">DELETE</span>
              </p>
            }
          </div>
        )
      })

      CustomObject = (
        <div className="custom-object-block">
          <p className="item-option-body-small margin-bottom-20">
            A custom object allows you to create a metric with multiple data types.
            </p>

          <div className="object-field-row">
            <div className="object-field-left">
              <p className="item-option-header-small item-left-field">Field name</p>
              <p className="item-option-header-small field-helper-text object-helper-text">
                The name of a data field. An example field for a <strong>Bike rides</strong> {" "}
                object would be <strong>Distance biked</strong> or <strong>Ride length</strong>.
              </p>
            </div>
            <div className="object-field-right">
              <p className="item-option-header-small item-left-field">Data type</p>
              <p className="item-option-header-small field-helper-text object-helper-text">
                The type of data this field represents. A <strong>Distance biked</strong> {" "}
                field would have a <strong>Number</strong> data type and a <strong>Ride length</strong> field would
                have a <strong>Time duration</strong> data type.
                </p>
            </div>
          </div>

          {CustomFields}
          <p
            onClick={this.onAddFieldClick}
            className="add-field-btn">&#x2b; Add field</p>
        </div>
      )
    }

    let TargetRows = null;
    if (this.state.item_type === 'optimization' && this.state.main_data_type.value === 'custom') {
      // for custom object types, we must show an additional selector
      // for the field they want to use as the value to optimize

      // we must make a list of options for the selector based on custom fields
      let target_field_options = this.state.custom_fields.map((field, index) => {
        return {
          value: index,
          label: field.field_name
        }
      });

      let TargetValueOptions = (
        <input
          disabled
          placeholder="Please select a target field above first."
          className="input ">
        </input>
      )
      // we must null check because target_field can be null
      console.log(this.state.target_field)
      if (this.state.target_field) {

        // to figure out what the target value options should be
        // we need to look at the selected target field
        // and generate a field depending on its data type
        console.log(this.state.target_field)

        // attempting to get the data type of the target field for a custom item
        let target_data_type;
        if (!this.state.custom_fields[this.state.target_field.value]) {
          target_data_type = null
        } else {
          target_data_type = this.state.custom_fields[this.state.target_field.value].data_type.value
        }
        console.log(target_data_type)
        // possible values are:
        // number: an input field that only allows numbers
        // boolean: a dropdown with True/False
        // text: text fields cannot be optimized
        // time: a time selector
        // time duration: a number input field and a selector field with seconds/minutes/hours/days/weeks/months/years
        // decimal: a text field that only allows numbers and periods
        switch (target_data_type) {
          case 'number':
            TargetValueOptions = (
              <div>
                <input
                  type="number"
                  value={this.state.target_value}
                  onChange={this.onTargetValueChange}
                  placeholder="Number"
                  className="input ">
                </input>
                <p className="item-option-header-small field-helper-text">
                  A number that represents the goal for your target field.
                  This can be updated in the future.
                </p>
              </div>
            )
            break
          case 'boolean':
            TargetValueOptions = (
              <div>
                <Select
                  value={this.state.target_value}
                  onChange={this.onTargetValueChange}
                  styles={selectStyles}
                  options={boolean_options} />
                <p className="item-option-header-small field-helper-text">
                  Whether your goal is to achieve (Yes) or avoid (No) your
                  target field. This can be updated in the future.
                  </p>
              </div>
            )
            break
          case 'text':
            TargetValueOptions = (
              <div>
                <input
                  disabled
                  placeholder="Text fields cannot be optimized."
                  className="input ">
                </input>
                <p className="item-option-header-small field-helper-text">
                  Only numerical fields
                  can be optimized.
                    </p>
              </div>
            )
            break
          case 'time':
            TargetValueOptions = (
              <div className="create-item-timekeeper-container">
                <TimePicker
                  value={this.state.target_time}
                  onChange={this.onTargetValueChange}
                  showSecond={false}
                  className="timepicker-style timepicker-style-create-page"
                  format="h:mm a"
                  use12Hours
                  inputReadOnly
                />
                <p className="item-option-header-small field-helper-text">
                  Select a target time for your target field. This can be updated in the future.
                    </p>
              </div>
            )
            break
          case 'time_duration':
            TargetValueOptions = (
              <div>
                <div className="create-item-time-duration-container">
                  <input
                    value={this.state.target_value}
                    onChange={this.onTargetValueChange}
                    placeholder="Number"
                    className="input time-duration-input" />
                  <Select
                    value={this.state.target_value_duration_unit}
                    onChange={this.onTargetValueDurationUnitChange}
                    className="time-duration-selector"
                    styles={selectStyles}
                    options={time_options} />
                </div>
                <p className="item-option-header-small field-helper-text">
                  Select a target time duration. This can be updated in the future.
                </p>
              </div>
            )
            break
          case 'decimal':
            TargetValueOptions = (
              <div>
                <input
                  placeholder="Enter a number"
                  className="input ">
                </input>
                <p className="item-option-header-small field-helper-text">
                  A decimal that represents the goal for your target field.
                  This can be updated in the future.
                </p>
              </div>
            )
            break
          default:
            break

        }
      }


      TargetRows = (
        <div>
          <div className="item-customization-row">
            <p className="item-option-header-small item-left-field">Target field</p>
            <div className="item-right-input">
              <Select
                onChange={this.onTargetFieldChange}
                value={this.state.target_field}
                styles={selectStyles}
                options={target_field_options} />
              <p className="item-option-header-small field-helper-text">
                The field of the custom object that you
                are looking to optimize.
              </p>
            </div>
          </div>
          <div className="item-customization-row">
            <p className="item-option-header-small item-left-field">Target value</p>
            <div className="item-right-input">
              {TargetValueOptions}
            </div>
          </div>
        </div>
      )

    } else if (this.state.item_type === 'optimization' && this.state.main_data_type.value !== 'custom') {
      // for an optimization item with a primitive field, we simply display the custom Target row
      // now we simply generate a target value row for an optimization item that is NOT custom
      let TargetValueOptions = (
        <input
          disabled
          placeholder="Please select a target field above first."
          className="input ">
        </input>
      )
      // we must null check because target_field can be null
      if (this.state.main_data_type.value) {
        // to figure out what the target value options should be
        // we need to look at the selected target field
        // and generate a field depending on its data type

        let target_data_type = this.state.main_data_type.value
        // possible values are:
        // number: an input field that only allows numbers
        // boolean: a dropdown with True/False
        // text: text fields cannot be optimized
        // time: a time selector
        // time duration: a number input field and a selector field with seconds/minutes/hours/days/weeks/months/years
        // decimal: a text field that only allows numbers and periods
        switch (target_data_type) {
          case 'number':
            TargetValueOptions = (
              <div>
                <input
                  value={this.state.target_value}
                  onChange={this.onTargetValueChange}
                  placeholder="Number"
                  className="input ">
                </input>
                <p className="item-option-header-small field-helper-text">
                  A number that represents the goal for your target field.
                  This can be updated in the future.
                </p>
              </div>
            )
            break
          case 'boolean':
            TargetValueOptions = (
              <div>
                <Select
                  value={this.state.target_value}
                  onChange={this.onTargetValueChange}
                  styles={selectStyles}
                  options={boolean_options} />
                <p className="item-option-header-small field-helper-text">
                  Whether your goal is to achieve (Yes) or avoid (No) your
                  target field. This can be updated in the future.
                  </p>
              </div>
            )
            break
          case 'text':
            TargetValueOptions = (
              <div>
                <input
                  disabled
                  placeholder="Text fields cannot be optimized."
                  value=""
                  className="input ">
                </input>
                <p className="item-option-header-small field-helper-text">
                  Only numerical fields
                  can be optimized.
                    </p>
              </div>
            )
            break
          case 'time':
            TargetValueOptions = (
              <div className="create-item-timekeeper-container">
                <TimePicker
                  value={this.state.target_time}
                  onChange={this.onTargetValueChange}
                  showSecond={false}
                  className="timepicker-style timepicker-style-create-page"
                  format="h:mm a"
                  use12Hours
                  inputReadOnly
                />
                <p className="item-option-header-small field-helper-text">
                  Select a target time for your target field. This can be updated in the future.
                    </p>
              </div>
            )
            break
          case 'time_duration':
            TargetValueOptions = (
              <div>
                <div className="create-item-time-duration-container">
                  <input
                    value={this.state.target_value}
                    onChange={this.onTargetValueChange}
                    placeholder="Number"
                    className="input time-duration-input" />
                  <Select
                    value={this.state.target_value_duration_unit}
                    onChange={this.onTargetValueDurationUnitChange}
                    className="time-duration-selector"
                    styles={selectStyles}
                    options={time_options} />
                </div>
                <p className="item-option-header-small field-helper-text">
                  Select a target time duration. This can be updated in the future.
                </p>
              </div>
            )
            break
          case 'decimal':
            TargetValueOptions = (
              <div>
                <input
                  placeholder="Enter a number"
                  className="input ">
                </input>
                <p className="item-option-header-small field-helper-text">
                  A decimal that represents the goal for your target field.
                  This can be updated in the future.
                </p>
              </div>
            )
            break
          default:
            break

        }
      }

      TargetRows = (
        <div className="item-customization-row">
          <p className="item-option-header-small item-left-field">Target value</p>
          <div className="item-right-input">
            {TargetValueOptions}
          </div>
        </div>
      )
    } else {
      // for a logging item, we do not display a Target row
      TargetRows = null;
    }

    return (
      <div className="Container">
        <LeftColumn page="create" />

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top ">
              <div className="main-message-box full-width-box middle-container-standard ">
                <div className="inner-text padding-bottom-10 grey-border-bottom">
                  <p><strong>Create a metric</strong></p>
                </div>
                <div className="inner-text grey-border-bottom grey-bg">
                  {/* <p className="item-option-header-small">What kind of metric would you like to begin tracking?</p> */}
                  <p className="create-metric-explanation">
                    A metric represents something you want to track. <span onClick={this.onReplayOnboardingClick} className="replay-onboarding">Play onboarding.</span>
                  </p>

                  <div className="item-option-container ">
                    <div
                      onClick={this.onOptimizationClick}
                      className={this.state.item_type === 'optimization' ? "item-option item-option-active margin-right-10" : "item-option margin-right-10"}>
                      <p className="no-padding item-option-header-small">Active optimization</p>
                      <p className="item-option-body-small">
                        A metric with a target value that you would like to achieve.
                        For example, going to the gym 7 days a week.
                </p>
                    </div>
                    <div
                      onClick={this.onLoggingClick}
                      className={this.state.item_type === 'logging' ? "item-option item-option-active margin-left-10" : "item-option margin-left-10"}>
                      <p className="no-padding item-option-header-small">Passive logging</p>
                      <p className="item-option-body-small">
                        A metric that you like to track and not optimize.
                        For example, logging each bike ride you took this week.
                </p>
                    </div>
                  </div>

                  <div className="item-customization-row">
                    <p className="item-option-header-small item-left-field">Metric name</p>
                    <div className="item-right-input">
                      <input
                        placeholder="Metric name"
                        value={this.state.item_name}
                        onChange={this.onItemNameChange}
                        className="input "></input>
                      <p className="item-option-header-small field-helper-text">
                        This is to help you keep track of this metric. Metric names should include a unit of measurement if applicable.</p>
                    </div>
                  </div>


                  <div className="item-customization-row">
                    <p className="item-option-header-small item-left-field">Data type</p>
                    <div className="item-right-input">
                      <Select
                        onChange={this.onDataTypeChange}
                        value={this.state.main_data_type}
                        styles={selectStyles}
                        options={data_options} />
                      <p className="item-option-header-small field-helper-text">
                        The type of data which would best represent the metric you're tracking.
                        For example, if you wanted to track whether you went to the gym
                  on a specific day, you would use a <strong>Yes/No</strong> data type.
                  </p>
                    </div>
                  </div>

                  {CustomObject}


                  <div className="item-customization-row">
                    <p className="item-option-header-small item-left-field">Frequency</p>
                    <div className="item-right-input">
                      <Select
                        value={this.state.frequency}
                        onChange={this.onFrequencyChange}
                        styles={selectStyles}
                        options={this.state.item_type === 'optimization' ? frequency_options_active : frequency_options_passive} />
                      <p className="item-option-header-small field-helper-text">
                        How frequently this metric should be tracked.
                        If you don't know how often this metric will be completed,
                  select <strong>passive logging</strong>.
                  </p>
                    </div>
                  </div>

                  {TargetRows}

                  <div className="create-errors-container">
                    {ErrorMessages}
                  </div>
                  <button onClick={this.onCreateItemClick} className="button create-item-button">
                    {this.state.submitting ? <img className="submit-btn-spinner" src={spinner} alt="" /> : "Create Metric"}
                  </button>


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
    clear_dates_dict,
    set_user_details
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(SuperCreate);

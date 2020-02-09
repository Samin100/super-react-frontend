import React, { Component } from 'react';
import moment from 'moment';

import '../App.css';
import '../Super.css';
import axios from 'axios';
import Spinner from '../spinner.svg'

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { show_app_notification, delete_app_notification, receive_items, set_items_list, set_dashboards_list } from '../actions/actions.js'
import { API_URL } from '../index.js';

import LeftColumn from './LeftColumn.js'

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

class CreateDashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      public: false,
      name: "",
      description: "",
      emoji: "📈",
      show_emoji_picker: false,
      submitting: false,
      redirect_to: null
    }

    this.onPrivacySwitched = this.onPrivacySwitched.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onEmojiClick = this.onEmojiClick.bind(this)
    this.onEmojiChange = this.onEmojiChange.bind(this)
    this.onCreateClick = this.onCreateClick.bind(this)

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && event.target.id !== "emoji") {
      this.setState({ show_emoji_picker: false });
    }
  }

  onEmojiClick = (e) => {
    this.setState({ show_emoji_picker: !this.show_emoji_picker })
  }

  onNameChange = (e) => {
    this.setState({ name: e.target.value })
  }

  onDescriptionChange = (e) => {
    this.setState({ description: e.target.value })
  }

  onPrivacySwitched = (e) => {
    this.setState({ public: !this.state.public })
  }

  onEmojiChange = (e) => {
    console.log(e.native)
    this.setState({ emoji: e.native, show_emoji_picker: false })
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onCreateClick = (e) => {

    // we do not submit if the name does not exist or we are already submitting
    if (this.state.name.trim() === "" || this.state.submitting) {
      return
    }

    this.setState({ submitting: true })

    const data = {
      name: this.state.name.trim(),
      public: this.state.public,
      description: this.state.description,
      emoji: this.state.emoji,
      submitting: false
    }
    console.log(data)

    axios.post(`${API_URL}/api/dashboard/create/`, data).then((res) => {

      // updating the redux store with the new dashboards array
      this.props.set_dashboards_list(res.data.dashboards)

      // redirecting the user to the new dashboard
      this.setState({ submitting: false, redirect_to: `/dashboard/${res.data.key}/` })
    }).catch((err) => {
      this.setState({ submitting: false })
    })

  }


  render() {

    // if we need to redirect
    if (this.state.redirect_to) {
      return <Redirect to={this.state.redirect_to} />
    }


    let EmojiPicker = null
    if (this.state.show_emoji_picker) {
      EmojiPicker = (
        <Picker
          value={this.state.emoji}
          className="emoji-picker"
          set="apple"
          onSelect={this.onEmojiChange}
          darkMode={false}
          title='Pick your icon' emoji='point_up'
          exclude={['recent']}
          style={{
            position: 'absolute',
            top: '-390px',
            left: '50px'
          }}

        />
      )
    }
    return (
      <div className="Container">
        <LeftColumn />
        <div className="inner-container">
          <div className="middle-col">
            <div className="create-dashboard-div">
              <h1 className="create-dashboard">Create dashboard</h1>
            </div>
            <p className="item-edit-subheading">
              Create a dashboard to easily visualize your tracked metrics.
          </p>
            < hr className="hr" />

            <p className="item-edit-heading"></p>

            <div className="privacy-switch-container">

              <div>
                <div className="onoffswitch">
                  <input checked={this.state.public} onChange={this.onPrivacySwitched} type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" />
                  <label className="onoffswitch-label" htmlFor="myonoffswitch">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                  </label>
                </div>
              </div>
              <p className="item-edit-subheading sub-private-heading">
                {this.state.public ?
                  "Anyone can view this dashboard." :
                  "Only you will be able to view this dashboard."
                }
              </p>


            </div>


            <p className="item-edit-heading">Dashboard name</p>
            <div className="item-name-update">
              <input
                value={this.state.name}
                className="input item-edit-input"
                onChange={this.onNameChange}
                placeholder="Productivity"
              />
            </div>

            <p className="item-edit-heading">Description</p>
            <p className="item-edit-subheading">
              A description explaining what this dashboard will display.
          </p>
            <div className="item-name-update">
              <input
                value={this.state.description}
                className="input item-edit-input"
                onChange={this.onDescriptionChange}
                placeholder="A dashboard for all my productivity related metrics."
              />
            </div>

            <p className="item-edit-heading">Icon</p>
            <div className="emoji-picker-container">
              <p onClick={this.onEmojiClick} className="emoji">
                {this.state.emoji}
              </p>
              <p className="item-edit-subheading">
                Select an icon for this dashboard.
          </p>
              <div id="emoji" ref={this.setWrapperRef}>
                {EmojiPicker}
              </div>
            </div>

            {this.state.submitting ?
              <button
                className="button create-dashboard-button spinner-button">
                <img className="small-spinner" alt="" src={Spinner} />
              </button>
              :
              <button
                onClick={this.onCreateClick}
                className="button create-dashboard-button">
                Create
            </button>
            }



          </div>

        </div>
      </div >
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
    set_items_list,
    show_app_notification,
    set_dashboards_list
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDashboard);

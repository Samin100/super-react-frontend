import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, useParams, withRouter } from "react-router-dom";
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
import spinner_black from '../static/images/spinner_black.svg'
import list from '../static/images/list.svg';
import hamburger_black from '../static/images/hamburger_black.svg'
import NotFound404 from '../404.js'
import Timekeeper from 'react-timekeeper';
import TimePicker from 'rc-time-picker';
import { selectStyles } from '../styles.js';
import { connect, Provider } from 'react-redux';
import { createStore, bindActionCreators } from 'redux'
import { show_app_notification, update_dates_dict, clear_dates_dict, delete_app_notification } from '../actions/actions.js'
import { API_URL } from '../index.js';
import { store } from '../index';
import Modal from 'react-modal';
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

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    maxWidth: '400px',
    transform: 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root')



class SuperItems extends Component {


  constructor(props) {
    super(props);

    let id = null;
    let redirect_404 = false;

    let path_list = window.location.pathname.split("/")

    if (path_list.length === 2) {
      // ex: /items
      id = null;
      redirect_404 = false;
    } else if (path_list.length === 3 && path_list[2] === "") {
      // ex: /items/
      id = null;
      redirect_404 = false;
    } else if (path_list.length === 3 && path_list[2] !== "") {
      // ex /items/123 or /items/abc
      let x = parseInt(path_list[2])
      if (isNaN(x)) {
        redirect_404 = true
        id = null
      } else {
        id = x
        redirect_404 = false
      }
    }


    this.state = {
      loading: true,
      active_item_index: id,
      redirect_404: redirect_404,
      items: [],
      working_items: [],
      archive_modal_open: false,
      delete_modal_open: false,
      unarchive_modal_open: false
    }

    this.onItemNameChange = this.onItemNameChange.bind(this);
    this.onItemRowClick = this.onItemRowClick.bind(this);
    this.ItemTable = this.ItemTable.bind(this);
    this.ActiveItem = this.ActiveItem.bind(this);
    this.LoadingItems = this.LoadingItems.bind(this);

    this.onArchiveClick = this.onArchiveClick.bind(this);
    this.onUnarchiveClick = this.onUnarchiveClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onUpdateNameClick = this.onUpdateNameClick.bind(this);

    // modal event handlers
    this.openArchiveModal = this.openArchiveModal.bind(this);
    this.closeArchiveModal = this.closeArchiveModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.openUnarchiveModal = this.openUnarchiveModal.bind(this);
    this.closeUnarchiveModal = this.closeArchiveModal.bind(this);

  }

  onUpdateNameClick(e) {
    e.preventDefault();
    let name = this.state.working_items[this.state.active_item_index].name
    name = name.trim()

    if (name === "") {
      return;
    }


    let item_key = this.state.items[this.state.active_item_index].key

    axios.post(`${API_URL}/api/items/update_name/`, { item_key: item_key, item_name: name })
      .then(res => {
        console.log("name updated")
        this.props.show_app_notification("Item name updated.")
        // refreshing the items list and the working items list
        axios.get(`${API_URL}/api/items/list/`)
          .then(res => {
            this.setState({
              items: res.data.items,
              working_items: res.data.items
            })
            this.props.clear_dates_dict()
          })
      })
  }

  onItemNameChange(e) {
    console.log(e.target.value)
    let new_working_items = [...this.state.working_items];
    console.log(new_working_items)
    new_working_items[this.state.active_item_index] = {
      ...this.state.working_items[this.state.active_item_index],
      name: e.target.value
    }
    this.setState({ working_items: new_working_items })
  }

  onUnarchiveClick(e) {
    console.log('unarchive', this.state.active_item_index)

    let item_key = this.state.items[this.state.active_item_index].key

    axios.post(`${API_URL}/api/items/unarchive/`, { item_key: item_key })
      .then(res => {
        // upon success, we redirect back to /items
        this.setState({ unarchive_modal_open: false, loading: true })

        axios.get(`${API_URL}/api/items/list/`)
          .then(res => {
            this.setState({
              loading: false,
              items: res.data.items,
              working_items: res.data.items
            })
            this.props.clear_dates_dict()
          })


      })
  }

  onArchiveClick(e) {
    console.log('archive', this.state.active_item_index)

    let item_key = this.state.items[this.state.active_item_index].key

    axios.post(`${API_URL}/api/items/archive/`, { item_key: item_key })
      .then(res => {
        // upon success, we redirect back to /items
        this.setState({ archive_modal_open: false, loading: true })

        axios.get(`${API_URL}/api/items/list/`)
          .then(res => {
            this.setState({
              loading: false,
              items: res.data.items,
              working_items: res.data.items
            })
            this.props.clear_dates_dict()
          })


      })
  }

  onDeleteClick(e) {
    console.log('delete', this.state.active_item_index)

    let item_key = this.state.items[this.state.active_item_index].key

    axios.post(`${API_URL}/api/items/delete/`, { item_key: item_key })
      .then(res => {
        // upon success, we redirect back to /items
        this.setState({ delete_modal_open: false, loading: true })

        axios.get(`${API_URL}/api/items/list/`)
          .then(res => {
            this.setState({
              loading: false,
              items: res.data.items,
              working_items: res.data.items
            })
            this.props.clear_dates_dict()
          })

        this.props.history.push('/items')
      })
  }

  openUnarchiveModal() {
    this.setState({ unarchive_modal_open: true, delete_modal_open: false });
  }

  closeunArchiveModal() {
    this.setState({ unarchive_modal_open: false, });
  }



  openArchiveModal() {
    this.setState({ archive_modal_open: true, delete_modal_open: false });
  }

  closeArchiveModal() {
    this.setState({ archive_modal_open: false, });
  }

  openDeleteModal() {
    this.setState({ delete_modal_open: true, archive_modal_open: false });
  }

  closeDeleteModal() {
    this.setState({ delete_modal_open: false });
  }



  ActiveItem(props) {

    let item = this.state.items[this.state.active_item_index]

    if (!item) {
      console.log('no item')
      return <NotFound404 />
    }

    let item_type;
    let item_type_text;
    switch (item.item_type) {
      case 'OPTIMIZATION':
        item_type = 'Optimization'
        item_type_text = 'An optimization item has a target value that you would like to achieve. '
        break
      case 'LOGGING':
        item_type = 'Logging'
        item_type_text = 'A logging item has no target value. Logging items are used to simply to log each occurrence of an item. '
        break
      default:
        item_type = 'unknown.'
    }


    let data_type;
    switch (item.data_type) {
      case 'NUMBER':
        data_type = 'Number'
        break
      case 'BOOLEAN':
        data_type = 'Yes/No'
        break
      case 'TEXT':
        data_type = 'Text'
        break
      case 'TIME':
        data_type = 'Time'
        break
      case 'TIME_DURATION':
        data_type = 'Time duration'
        break
      case 'CUSTOM':
        data_type = 'Custom'
        break
      default:
        data_type = '-'
    }

    let frequency;
    switch (item.frequency) {
      case 'DAILY':
        frequency = 'Daily'
        break
      case 'WEEKLY':
        frequency = 'Weekly'
        break;
      case 'MONTHLY':
        frequency = 'Monthly'
        break;
      case 'QUARTERLY':
        frequency = 'Quarterly'
        break
      case 'YEARLY':
        frequency = 'Yearly'
        break
      case 'ON_DEMAND':
        frequency = 'On demand'
        break
      default:
        frequency = '-'
        break
    }

    let Target = null;
    let target_value = "";


    if (typeof item.target_value === 'string') {
      target_value = item.target_value;
    } else if (typeof item.target_value === 'object') {

      if (item.target_value && item.target_value.value) {
        item.target_value.value.toLowerCase()
      }

    }

    if (item.item_type === 'OPTIMIZATION') {
      Target = (
        <div className="item-edit-row">
          <p className="item-edit-heading">Target value: {target_value}</p>
          <p className="item-edit-subheading">
            An item's target value is its optimal value.
        </p>
        </div>
      )
    }

    // rendering the custom fields 
    let CustomItem = null;
    if (item.data_type === "CUSTOM") {

      let CustomFields = item.custom_fields.map((custom_item, index) => {

        let data_type;
        switch (custom_item.field_type) {
          case 'NUMBER':
            data_type = 'Number'
            break
          case 'BOOLEAN':
            data_type = 'Yes/No'
            break
          case 'TEXT':
            data_type = 'Text'
            break
          case 'TIME':
            data_type = 'Time'
            break
          case 'TIME_DURATION':
            data_type = 'Time duration'
            break
          case 'CUSTOM':
            data_type = 'Custom'
            break
          default:
            data_type = '-'
        }
        return (
          <p key={index} className="item-edit-heading custom-field-edit">{index + 1}) {custom_item.name}: {data_type} field</p>

        )
      });

      CustomItem = (
        <div className="item-edit-row">
          <p className="item-edit-heading">Custom fields</p>
          <p className="item-edit-subheading custom-field-edit">
            The fields that the belong to this custom object.
          </p>
          {CustomFields}
        </div>
      )
    }

    let ArchivedMessage = null;
    let ArchivedRow = null
    if (item.archived) {
      ArchivedMessage = (
        <p className="archived-item">
          This item is currently archived and cannot be updated.
        </p>
      )

      ArchivedRow = (
        <div className="item-edit-row">
          <p className="item-edit-heading">Unarchive item</p>
          <p className="item-edit-subheading">
            Unarchiving this item willreactivate it.
            An item can be unarchived at any time.
        </p>
          <button
            onClick={this.openUnarchiveModal}
            className="button edit-item-button archive-button">Unarchive</button>
        </div>
      )
    } else (
      ArchivedRow = (
        <div className="item-edit-row">
          <p className="item-edit-heading">Archive item</p>
          <p className="item-edit-subheading">
            Archiving this item will hide it until it is unarchived.
            This is helpful if you want to disable an item without
            losing any data. An item can be unarchived at any time.
        </p>
          <button
            onClick={this.openArchiveModal}
            className="button edit-item-button archive-button">Archive item</button>
        </div>
      )
    )

    return (
      < div className="Container" >
        <LeftColumn page="items" />

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top ">
              <div className="main-message-box full-width-box middle-container-standard ">
                <div className="inner-text padding-bottom-10 grey-border-bottom">
                  <p><strong>My Items</strong></p>
                </div>
                <div className="inner-text grey-border-bottom grey-bg">
                  {ArchivedMessage}

                  <div className="item-edit-row">
                    <p className="item-edit-heading">Item name</p>
                    <p className="item-edit-subheading">
                      A simple name for the item you're tracking.
                    </p>
                    <div className="item-name-update">
                      <form onSubmit={this.onUpdateNameClick}>
                        <input
                          value={this.state.working_items[this.state.active_item_index].name}
                          className="input item-edit-input"
                          onChange={this.onItemNameChange}
                          placeholder="Item name"
                        />
                        <button
                          type="submit"
                          className="button update-name-btn">&#x2714;</button>
                      </form>
                    </div>
                  </div>

                  {Target}

                  <div className="item-edit-row">
                    <p className="item-edit-heading">Frequency: {frequency}</p>
                    <p className="item-edit-subheading">
                      An item's frequency determines how often it should be updated.
                      This item should be updated <strong>{frequency.toLowerCase()}</strong>.
Frequency is set upon item creation.
                    </p>
                  </div>

                  <div className="item-edit-row">
                    <p className="item-edit-heading">Data type: {data_type}</p>
                    <p className="item-edit-subheading">
                      An item's data type describes the type of data
                      this item tracks. This item has a <strong>{data_type.toLowerCase()}</strong> data type.
Data type is set upon item creation.
                    </p>
                  </div>

                  <div className="item-edit-row">
                    <p className="item-edit-heading">Item type: {item_type}</p>
                    <p className="item-edit-subheading">
                      {item_type_text}
                      Item types cannot be changed after creation.
                    </p>
                  </div>
                  {CustomItem}


                  {ArchivedRow}

                  <div className="item-edit-row">
                    <p className="item-edit-heading">Delete item</p>
                    <p className="item-edit-subheading">
                      Deleting this item will permanently delete this item and all of its data.
                      This action is irreversible.
                    </p>
                    <button
                      onClick={this.openDeleteModal}
                      className="button edit-item-button delete-button">Delete item</button>
                  </div>
                  <p className="item-edit-subheading">
                    This item was created {moment(item.created).fromNow()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    )
  }

  ItemTable(props) {

    let Rows = this.state.items.map((item, index) => {

      let data_type;
      switch (item.data_type) {
        case 'NUMBER':
          data_type = 'Number'
          break
        case 'BOOLEAN':
          data_type = 'Yes/No'
          break
        case 'TEXT':
          data_type = 'Text'
          break
        case 'TIME':
          data_type = 'Time'
          break
        case 'TIME_DURATION':
          data_type = 'Time duration'
          break
        case 'CUSTOM':
          data_type = 'Custom'
          break
        default:
          data_type = '-'
      }

      let frequency;
      switch (item.frequency) {
        case 'DAILY':
          frequency = 'Daily'
          break
        case 'WEEKLY':
          frequency = 'Weekly'
          break;
        case 'MONTHLY':
          frequency = 'Monthly'
          break;
        case 'QUARTERLY':
          frequency = 'Quarterly'
          break
        case 'YEARLY':
          frequency = 'Yearly'
          break
        case 'ON_DEMAND':
          frequency = 'On demand'
          break
        default:
          frequency = '-'
          break
      }

      let item_type;
      switch (item.item_type) {
        case 'OPTIMIZATION':
          item_type = 'Optimization'
          break
        case 'LOGGING':
          item_type = 'Logging'
          break
        default:
          item_type = ''
      }

      return (
        <tr onClick={this.onItemRowClick} className="tr-body" key={index} data-key={index}>
          <td>
            {item.name}
          </td>
          <td>
            {data_type}
          </td>
          <td>
            {frequency}
          </td>
          <td>
            {item_type}
          </td>
          <td>
            {moment(item.created).fromNow()}
          </td>
        </tr>
      )
    });

    if (Rows.length === 0) {
      Rows = (
        <tr onClick={() => this.props.history.push("/create")} className="tr-body">
          <td>You have no items. <Link to="/create">Create an item.</Link></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      )
    }

    return (
      < div className="Container" >
        <LeftColumn page="items" />

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top ">
              <div className="main-message-box full-width-box middle-container-standard ">
                <div className="inner-text padding-bottom-10 grey-border-bottom">
                  <p><strong>My Items</strong></p>
                </div>
                <div className="inner-text grey-border-bottom grey-bg">
                  <table>
                    <thead>
                      <tr className="tr-header">
                        <th>Name</th>
                        <th>Data Type</th>
                        <th>Frequency</th>
                        <th>Item Type</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Rows}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )

  }

  onItemRowClick(e) {
    // when a user clicks an item row, i want to be able to change the URL to a specific value
    this.props.history.push(`/items/${e.currentTarget.dataset.key}`)
    this.setState({ active_item_index: parseInt(e.currentTarget.dataset.key) })

  }

  componentDidUpdate(prevProps) {
    /*
    This function is called when the URL changes. We must update the item ID 
    based on the new URL. We validate the new ID, and update the state accordingly.
  
    If the URL is invalid, we display a 404 by setting redirect_404 = true.
    */

    // showing notifications
    this.props.app_notifications.map((message) => {
      toast.success(message)
      this.props.delete_app_notification(message)
      return null
    })

    let old_path = prevProps.location.pathname
    let new_path = this.props.location.pathname

    if (old_path !== new_path) {

      let path_list = window.location.pathname.split("/")

      let redirect_404 = false;
      let id = null;

      if (path_list.length === 2) {
        // ex: /items
        id = null;
        redirect_404 = false;
      } else if (path_list.length === 3 && path_list[2] === "") {
        // ex: /items/
        id = null;
        redirect_404 = false;
      } else if (path_list.length === 3 && path_list[2] !== "") {
        // ex: /items/123 or /items/abc
        let x = parseInt(path_list[2])
        if (isNaN(x)) {
          redirect_404 = true
          id = null
        } else {
          id = x
          redirect_404 = false
        }
      }

      if (id < this.state.items.length) {
        // if the ID is a valid item index
        this.setState({ active_item_index: id, redirect_404: redirect_404 })
      } else {
        this.setState({ active_item_index: null, redirect_404: true })
      }

    }

  }


  componentDidMount() {

    axios.get(`${API_URL}/api/items/list/`)
      .then(res => {
        this.setState({
          loading: false,
          items: res.data.items,
          working_items: res.data.items
        })

        // if there was an error, we display it in a notification
        if (res.data && res.data.error) {
          toast.error(res.data.error);
        } else {
        }
      })
      .catch((err, res) => {

      });

  }

  LoadingItems(props) {
    return (
      <div className="Container">
        <LeftColumn page="items" />

        <div className="Middle">
          <div className="middle-max-width">
            <div className="middle-container-top ">
              <div className="main-message-box full-width-box middle-container-standard ">
                <div className="inner-text padding-bottom-10 grey-border-bottom">
                  <p><strong>My Items</strong></p>
                </div>
                <div className="inner-text grey-border-bottom grey-bg">
                  <img className="spinner spinner-content" src={spinner_black} alt="" />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  render() {

    // we redirect to the main app if this is set to true
    if (this.state.redirect_to_app) {
      return <Redirect to="/" />
    }

    // if the items dict is still loading, we display a spinner
    if (this.state.loading) {
      return this.LoadingItems()
    }

    if (this.state.redirect_404) {
      console.log('not found')
      return <NotFound404 />
    }


    // we return a router for the items page with each subpage being a new item
    return (
      <div>
        <Modal
          closeTimeoutMS={100}
          style={modalStyles}
          isOpen={this.state.archive_modal_open}
          onRequestClose={this.closeArchiveModal}
        >
          <p className="modal-p">Are you sure you want to archive this item?</p>
          <div className="button-pair-container">
            <button
              onClick={this.closeArchiveModal}
              className="button edit-item-button cancel-button">Cancel</button>
            <button
              onClick={this.onArchiveClick}
              className="button edit-item-button archive-button margin-left-20">Archive item</button>
          </div>
        </Modal>

        <Modal
          closeTimeoutMS={100}
          style={modalStyles}
          isOpen={this.state.unarchive_modal_open}
          onRequestClose={this.closeUnrchiveModal}

        >
          <p className="modal-p">Are you sure you want to unarchive this item?</p>
          <div className="button-pair-container">
            <button
              onClick={this.closeUnarchiveModal}
              className="button edit-item-button cancel-button">Cancel</button>
            <button
              onClick={this.onUnarchiveClick}
              className="button edit-item-button archive-button margin-left-20">Unarchive</button>
          </div>
        </Modal>

        <Modal
          closeTimeoutMS={100}
          style={modalStyles}
          isOpen={this.state.delete_modal_open}
          onRequestClose={this.closeDeleteModal}
        >
          <p className="modal-p">
            Are you sure you want to permanently delete this item and
           all of its data?
           </p>
          <div className="button-pair-container">
            <button
              onClick={this.closeDeleteModal}
              className="button edit-item-button cancel-button">Cancel</button>
            <button
              onClick={this.onDeleteClick}
              className="button edit-item-button delete-button margin-left-20">Delete item</button>
          </div>
        </Modal>

        <Route path="/items/:id" component={this.ActiveItem} />
        <Route exact path="/items" component={this.ItemTable} />
      </div >
    )

  }

}


// this function maps the redux state to props this component can access
const mapStateToProps = state => {
  return {
    app_notifications: state.app_notifications,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    show_app_notification,
    delete_app_notification,
    update_dates_dict,
    clear_dates_dict
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SuperItems));


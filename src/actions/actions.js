// This file contains all the action types and action creators used by Super.


export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export function set_user_details(user) {
  return {
    type: SET_USER_DETAILS,
    user: user
  }
}

export const LOG_USER_OUT = 'LOG_USER_OUT';
export const log_user_out = () => ({ type: LOG_USER_OUT })

export const RECEIVE_LOGIN_RESPONSE = 'RECEIVE_LOGIN_RESPONSE'
export const receive_login_response = () => ({ type: RECEIVE_LOGIN_RESPONSE })


// action to show a notification in the main app
export const SHOW_APP_NOTIFICATION = 'SHOW_APP_NOTIFICATION'
export function show_app_notification(message) {
  return {
    type: SHOW_APP_NOTIFICATION,
    message: message
  }
}


// action to delete notification after it has been shown
export const DELETE_APP_NOTIFICATION = 'DELETE_APP_NOTIFICATION'
export function delete_app_notification(message) {
  return {
    type: DELETE_APP_NOTIFICATION,
    message: message
  }
}

// actions relating to fetching Items via the API
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const receive_items = () => ({ type: RECEIVE_ITEMS })
export const CLEAR_RECEIVE_ITEMS = 'CLEAR_RECEIVE_ITEMS'
export const clear_receive_items = () => ({ type: CLEAR_RECEIVE_ITEMS })

export const REFRESH_ITEMS = 'REFRESH_ITEMS'
export const request_item_refresh = () => ({ type: REFRESH_ITEMS })
export const REFRESH_ITEMS_COMPLETE = 'REFRESH_ITEMS_COMPLETE'
export const item_refresh_complete = () => ({ type: REFRESH_ITEMS_COMPLETE })


export const SET_ITEMS_LIST = 'SET_ITEMS_LIST'
export function set_items_list(items) {
  return {
    type: SET_ITEMS_LIST,
    items: items
  }
}
export const SET_WORKING_ITEMS_LIST = 'SET_WORKING_ITEMS_LIST'
export function set_working_items_list(items) {
  return {
    type: SET_WORKING_ITEMS_LIST,
    items: items
  }
}

export const UPDATE_DATES_DICT = 'UPDATE_DATES_DICT'
export function update_dates_dict(dates) {
  return {
    type: UPDATE_DATES_DICT,
    dates: dates
  }
}

export const UPDATE_WORKING_DATES_DICT = 'UPDATE_WORKING_DATES_DICT'
export function update_working_dates_dict(dates) {
  return {
    type: UPDATE_WORKING_DATES_DICT,
    dates: dates
  }
}

export const REQUEST_DATE_RANGE = 'REQUEST_DATE_RANGE'
export function request_date_range(start_date, end_date) {
  return {
    type: REQUEST_DATE_RANGE,
    start_date: start_date,
    end_date: end_date
  }
}

export const CLEAR_DATES_DICT = 'CLEAR_DATES_DICT'
export const clear_dates_dict = () => ({ type: CLEAR_DATES_DICT })

export const SET_DASHBOARDS_LIST = 'SET_DASHBOARDS_LIST'
export function set_dashboards_list(dashboards) {
  return {
    dashboards: dashboards,
    type: SET_DASHBOARDS_LIST
  }
}

export const SET_VARIABLES_LIST = 'SET_VARIABLES_LIST'
export function set_variables_list(variables) {
  return {
    type: SET_VARIABLES_LIST,
    variables: variables
  }
}
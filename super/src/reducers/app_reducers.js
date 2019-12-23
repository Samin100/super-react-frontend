import {
  SHOW_APP_NOTIFICATION,
  DELETE_APP_NOTIFICATION,
  RECEIVE_ITEMS,
  SET_ITEMS_LIST,
  CLEAR_RECEIVE_ITEMS,
  REFRESH_ITEMS,
  REFRESH_ITEMS_COMPLETE,
  SET_WORKING_ITEMS_LIST,
  UPDATE_DATES_DICT,
  UPDATE_WORKING_DATES_DICT
} from '../actions/actions.js'


/*
The most important thing to remember when writing reducers is to
think deeply about what the default state should be. Keep in mind that
EVERY action gets passed to EVERY reducer, so the default action in the switch
case statement should be well thought out. If you're encountering any bugs
with state not persisting, then it's mostly like due to an invalid default state.
*/

export function app_notifications(state = [], action) {
  switch(action.type) {
    case SHOW_APP_NOTIFICATION:
      return state.concat(action.message)
    case DELETE_APP_NOTIFICATION:
      if (state.indexOf(action.message) > -1) {
          let new_state = [...state]
          new_state.splice(state.indexOf(action.message), 1)
          return new_state
      }
      return state
    default:
      return state
  }
}

export function items_received(state = false, action) {
  switch(action.type) {
    case RECEIVE_ITEMS:
      return true
    case CLEAR_RECEIVE_ITEMS:
      return false
    default:
      return state
  }
}

export function refresh_items(state = false, action) {
  switch(action.type) {
    case REFRESH_ITEMS:
      return true
    case REFRESH_ITEMS_COMPLETE:
      return false
    default:
      return state
  }
}



export function items(state = [], action) {
  switch(action.type) {
    case SET_ITEMS_LIST:
      return action.items
    default:
      return state
  }
}


export function working_items(state = [], action) {
  switch(action.type) {
    case SET_WORKING_ITEMS_LIST:
      // in the case we want to update only the working items list
      // we use a SET_WORKING_ITEMS_LIST action
      return action.items
    case SET_ITEMS_LIST:
      // if we want to update both items as well as working_items
      // we can issue a SET_ITEMS_LIST action
      return action.items
    default:
      return state
  }
}


export function dates(state = {}, action) {
  // the reducer for the dates dictionary
  switch(action.type) {
    case UPDATE_DATES_DICT:
      // we simply add the existing items from the update 
      return {
        ...state,
        ...action.dates
      }
    default:
      return state
  }
}


export function working_dates(state = {}, action) {
  // the reducer for the working_dates dictionary
  switch(action.type) {
    case UPDATE_DATES_DICT:
      // if we want to update both items as well as working_items
      return {
        ...state,
        ...action.dates
      }

    case UPDATE_WORKING_DATES_DICT:
      // if we want to update only the working items dict 
      return {
        ...state,
        ...action.dates
      }
    default:
      return state
  }
}

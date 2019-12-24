import {
  RECEIVE_LOGIN_RESPONSE,
  SET_USER_DETAILS,
  LOG_USER_OUT
} from '../actions/actions.js'


/*
The most important thing to remember when writing reducers is to
think deeply about what the default state should be. Keep in mind that
EVERY action gets passed to EVERY reducer, so the default action in the switch
case statement should be well thought out. If you're encountering any bugs
with state not persisting, then it's mostly like due to an invalid default state.
*/

export function user(state = { logged_in: false }, action) {

  switch(action.type) {
    case SET_USER_DETAILS:
      return action.user
    case LOG_USER_OUT:
      return {logged_in: false}
    default:
      return state
  }
}

export function login_response_received(state = false, action) {
  switch(action.type) {
    case RECEIVE_LOGIN_RESPONSE:
      return true
    default:
      return state
  }
}

import { combineReducers } from 'redux'
import {
  user,
  login_response_received
} from './auth_reducers'

import {
  app_notifications,
  items_received,
  items,
  working_items,
  refresh_items,
  dates,
  working_dates,
  dashboards,
  variables
} from './app_reducers'

export default combineReducers({
  user,
  login_response_received,
  app_notifications,
  items_received,
  items,
  working_items,
  refresh_items,
  dates,
  working_dates,
  dashboards,
  variables
})

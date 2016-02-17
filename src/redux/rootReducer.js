import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import auth from './modules/auth'
import twitter from './modules/twitter'

export default combineReducers({
  auth,
  twitter,
  router
})

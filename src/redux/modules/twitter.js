import fetch from 'isomorphic-fetch'
import { getAccessToken } from '../utils/auth'
import { getTopTerms } from '../utils/terms'

/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const CREDENTIALS_START = 'CREDENTIALS_START'
export const CREDENTIALS_COMPLETE = 'CREDENTIALS_COMPLETE'
export const CREDENTIALS_ERROR = 'CREDENTIALS_ERROR'
export const TWEETS_START = 'TWEETS_START'
export const TWEETS_COMPLETE = 'TWEETS_COMPLETE'
export const TWEETS_ERROR = 'TWEETS_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
export const credentialsStart = (): Action => ({
  type: CREDENTIALS_START
})

export const credentialsComplete = (id: string, screenName: string): Action => ({
  type: CREDENTIALS_COMPLETE,
  payload: {
    id,
    screenName
  }
})

export const credentialsError = (error: string): Action => ({
  type: CREDENTIALS_ERROR,
  error
})

export const getCredentials = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    dispatch(credentialsStart())

    const accessToken = getAccessToken()
    const baseUrl = 'https://***REMOVED***/getTwitterCredentials'
    const url = `${baseUrl}?accessToken=${accessToken.accessToken}&accessTokenSecret=${accessToken.accessTokenSecret}`
    console.log(url)
    return fetch(url)
      .then((response) => {
        if (!response || !response.ok) {
          credentialsError(response.statusText)
        }

        return response.json()
      })
      .then((json) => {
        console.log('@-->response json', json)

        dispatch(credentialsComplete(json.id_str, json.screen_name))
        return json
      })
      .catch((response) => {
        console.log('fail', response)
        dispatch(credentialsError(response))
      })
  }
}

export const tweetsStart = (): Action => ({
  type: TWEETS_START
})

export const tweetsComplete = (tweets: Array, topTerms: Array): Action => ({
  type: TWEETS_COMPLETE,
  payload: {
    tweets: tweets.map((item) => item.id_str),
    topTerms: topTerms
  }
})

export const tweetsError = (error: string): Action => ({
  type: TWEETS_ERROR,
  error
})

export const getTweets = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    dispatch(tweetsStart())

    const accessToken = getAccessToken()
    const screenName = getState().twitter.screenName
    const count = 100
    const baseUrl = 'https://***REMOVED***/getTwitterTimeline'
    const url = `${baseUrl}?type=user&screen_name=${screenName}&count=${count}&accessToken=${accessToken.accessToken}&accessTokenSecret=${accessToken.accessTokenSecret}`
    console.log(url)
    return fetch(url)
      .then((response) => {
        if (!response || !response.ok) {
          tweetsError(response.statusText)
        }
        return response.json()
      })
      .then((json) => {
        console.log('@-->response json', json)

        dispatch(tweetsComplete(json, getTopTerms(json)))

        return json
      })
      .catch((response) => {
        console.log('fail', response)
        dispatch(tweetsError(response))
      })
  }
}

export const actions = {
  getCredentials,
  getTweets
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CREDENTIALS_COMPLETE]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [CREDENTIALS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, action.error),
  [TWEETS_COMPLETE]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [TWEETS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, action.error)
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  id: null,
  screenName: null,
  tweets: [],
  topTerms: [],
  error: null
}
export default function twitterReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

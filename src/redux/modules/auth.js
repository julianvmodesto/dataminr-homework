import fetch from 'isomorphic-fetch'
import { removeRequestToken, storeRequestToken,
  getRequestToken, storeAccessToken, getAccessToken, clean } from '../utils/auth'

/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const OAUTH_START = 'OAUTH_START'
export const OAUTH_COMPLETE = 'OAUTH_COMPLETE'
export const OAUTH_ERROR = 'OAUTH_ERROR'
export const REQUEST_TOKEN_RECEIVE = 'REQUEST_TOKEN_RECEIVE'
export const ACCESS_TOKEN_RECEIVE = 'ACCESS_TOKEN_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------
export const oauthStart = (): Action => ({
  type: OAUTH_START
})

export const oauthEnd = (): Action => ({
  type: OAUTH_COMPLETE
})

export const oauthError = (error: string): Action => ({
  type: OAUTH_ERROR,
  error
})

export const receiveRequestToken = (requestToken: string, requestTokenSecret: string): Action => ({
  type: REQUEST_TOKEN_RECEIVE,
  payload: {
    requestToken,
    requestTokenSecret
  }
})

export const receiveAccessToken = (accessToken: string, accessTokenSecret: string): Action => ({
  type: ACCESS_TOKEN_RECEIVE,
  payload: {
    accessToken,
    accessTokenSecret
  }
})

export const requestRequestToken = (endpointKey: string): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    // Begin OAuth secret handshake
    // https://youtu.be/obgA89jHi0U
    dispatch(oauthStart(endpointKey))

    // Remove existing any request or access tokens to do a fresh authorization
    clean()

    // API 1
    const callbackUrl = 'http://127.0.0.1:3000/twitter-auth-success'
    return fetch(`https://***REMOVED***/getTwitterRequestToken?callback=${callbackUrl}`)
      .then((response) => {
        if (!response || !response.ok) {
          dispatch(oauthError(response.statusText))
        }
        return response.json()
      })
      .then((json) => {
        console.log('@-->response json', json)
        dispatch(receiveRequestToken(json.requestToken, json.requestTokenSecret))

        const requestToken = {
          requestToken: json.requestToken,
          requestTokenSecret: json.requestTokenSecret
        }
        storeRequestToken(requestToken)

        // Redirect to Twitter user authorization
        const url = `https://api.twitter.com/oauth/authorize?oauth_token=${json.requestToken}`
        window.location.replace(url)

        return requestToken
      })
      .catch((response) => {
        console.log('fail', response)
        dispatch(oauthError(response))
      })
  }
}

export const requestAccessToken = (): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    // Check if we already have an access token in our cookies
    let accessToken = getAccessToken()

    if (accessToken) {
      // If we do have the OAuth access token stored in our cookies, then:
      dispatch(receiveAccessToken(accessToken.accessToken, accessToken.accessTokenSecret))
      dispatch(oauthEnd())
      // By convention, return a resolved Promise
      return Promise.resolve()
    } else {
      // If we don't have the OAuth access token stored in our cookies, then request one
      const requestToken = getRequestToken()
      const oauth = getState().router.locationBeforeTransitions.query

      const api = 'https://***REMOVED***/getTwitterAccessToken'
      const url = `${api}?requestToken=${requestToken.requestToken}&requestTokenSecret=${requestToken.requestTokenSecret}&oauth_verifier=${oauth.oauth_verifier}`

      // We don't need the request token anymore
      removeRequestToken()

      return fetch(url)
        .then((response) => {
          if (!response || !response.ok) {
            dispatch(oauthError(response.statusText))
          }
          return response.json()
        })
        .then((json) => {
          console.log('@-->response json', json)
          dispatch(receiveAccessToken(json.accessToken, json.accessTokenSecret))

          accessToken = {
            accessToken: json.accessToken,
            accessTokenSecret: json.accessTokenSecret
          }
          storeAccessToken(accessToken)

          dispatch(oauthEnd())
          return accessToken
        })
        .catch((response) => {
          console.log('fail', response)
          dispatch(oauthError(response))
        })
    }
  }
}

export const actions = {
  requestRequestToken,
  requestAccessToken
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OAUTH_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, {error: action.error})
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  error: null
}
export default function authReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

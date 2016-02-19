import fetch from 'isomorphic-fetch'
import { getAccessToken } from '../utils/auth'

import common from 'common-words'
import twitter from 'twitter-text'

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
export const TOP_TERMS_START = 'TOP_TERMS_START'
export const TOP_TERMS_COMPLETE = 'TOP_TERMS_COMPLETE'
export const TOP_TERMS_ERROR = 'TOP_TERMS_ERROR'

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
  type: TWEETS_START,
  payload: {
    tweetsLoading: true
  }
})

export const tweetsComplete = (tweets: Array): Action => ({
  type: TWEETS_COMPLETE,
  payload: {
    tweetsLoading: false,
    tweets
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

        dispatch(tweetsComplete(json.map((tweet) => tweet.id_str)))

        return json
      })
      .catch((response) => {
        console.log('fail', response)
        dispatch(tweetsError(response))
      })
  }
}

export const topTermsStart = (): Action => ({
  type: TOP_TERMS_START,
  payload: {
    topTermsLoading: true
  }
})

export const topTermsComplete = (topTerms: Array): Action => ({
  type: TOP_TERMS_COMPLETE,
  payload: {
    topTermsLoading: false,
    topTerms
  }
})

export const topTermsError = (error: string): Action => ({
  type: TOP_TERMS_ERROR,
  error
})

export const getTopTerms = (tweets: Array): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    dispatch(topTermsStart())
    // Ignore common words
    const ignoreWords = common.map((item) => item.word)
    ignoreWords.push('is', 're', 'are', 'where', 'http', 'https', 'don', 'sure')

    // Map of word counts
    const counts = new Map()

    tweets
      .map((tweet) => tweet.text)
      // Remove Twitter Entities from Tweet i.e. hashtags, mentions, URLs
      .map((text) => {
        const entities = twitter.extractEntitiesWithIndices(text)

        // Iterate the list of entities in reverse
        // in order to correctly splice out the indices
        for (let i = entities.length - 1; i >= 0; i--) {
          let [start, end] = entities[i].indices
          // Splice out text
          text = text.slice(0, start) + '' + text.slice(end)
        }
        return text
      })
      // Concat text
      .reduce((a, b) => a + ' ' + b)
      // Match whole words
      .match(/[a-z]+|\d+/igm)
      .filter((word) => word.length > 1 && word !== 'RT' && !ignoreWords.includes(word.toLowerCase()))
      // Do word count
      .forEach((word) => {
        let count = counts.get(word) || 0
        counts.set(word, count + 1)
      })
    // Sort words by counts, descending
    let ret = Array.from(counts.entries()).map(([word, count]) => ({word, count}))
    ret.sort((a, b) => b.count - a.count)
    // Return only top 10 terms
    ret = ret.length > 10 ? ret.slice(0, 10) : ret
    dispatch(topTermsComplete(ret))
    return Promise.resolve(ret)
  }
}

export const actions = {
  getCredentials,
  getTweets,
  getTopTerms
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CREDENTIALS_COMPLETE]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [CREDENTIALS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, {error: action.error}),
  [TWEETS_START]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [TWEETS_COMPLETE]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [TWEETS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, {error: action.error}),
  [TOP_TERMS_START]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [TOP_TERMS_COMPLETE]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [TOP_TERMS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, {error: action.error})
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  id: null,
  screenName: null,
  tweets: [],
  tweetsLoading: true,
  topTerms: [],
  topTermsLoading: true,
  error: null
}
export default function twitterReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

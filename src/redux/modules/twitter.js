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

export const tweetsComplete = (tweets: Array, topWords: Array): Action => ({
  type: TWEETS_COMPLETE,
  payload: {
    tweets: tweets.map((item) => item.id_str),
    topWords: topWords
  }
})

export const tweetsError = (error: string): Action => ({
  type: TWEETS_ERROR,
  error
})

// http://stackoverflow.com/a/12646864/1881379
function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

const wordCount = (tweets: Array): Array => {
  // Ignore common words
  const ignoreWords = common.map((item) => item.word)
  ignoreWords.push('is', 're', 'are', 'where', 'https', 'don', 'sure')

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
  // Sort words by counts
  let ret = Array.from(counts.entries())
  ret.sort((a, b) => b[1] - a[1])
  ret = ret.slice(0, 10)
  shuffleArray(ret)
  return ret
}

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

        dispatch(tweetsComplete(json, wordCount(json)))

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
  topWords: [],
  error: null
}
export default function twitterReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

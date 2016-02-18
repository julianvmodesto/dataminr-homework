import fetch from 'isomorphic-fetch'

/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const NEWS_START = 'NEWS_START'
export const NEWS_COMPLETE = 'NEWS_COMPLETE'
export const NEWS_ERROR = 'NEWS_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
export const newsStart = (): Action => ({
  type: NEWS_START,
  payload: {
    loading: true
  }
})

export const newsComplete = (news: Array): Action => ({
  type: NEWS_COMPLETE,
  payload: {
    loading: false,
    news
  }
})

export const newsError = (error: string): Action => ({
  type: NEWS_ERROR,
  error
})

// ~temporary APi key for this application~ shhh
const NYT_API_KEY = encodeURIComponent('***REMOVED***')

const getNewsForTerm = (term: string): Promise => {
  // Luckily, the NYT API rate limit is exactly 10 hits per second,
  // and we'll query the APi for at *most* 10 terms :)
  const baseUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
  const url = `${baseUrl}?q=${term}&begin_date=20160101&api-key=${NYT_API_KEY}`

  return fetch(url)
    .then((response) => {
      if (!response || !response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    })
    .then((json) => {
      return json.response.docs
    })
}

export const getNews = (topTerms: Array): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    dispatch(newsStart())

    // Get news for all terms
    return Promise.all(topTerms.map((term) => getNewsForTerm(term.word)))
      .then((news) => {
        dispatch(newsComplete(news))
        return news
      })
      .catch((response) => {
        console.log('fail', response)
        dispatch(newsError(response))
      })
  }
}

export const actions = {
  getNews
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [NEWS_COMPLETE]: (state: Object, action: {payload: Object}): Object => Object.assign({}, state, action.payload),
  [NEWS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, {error: action.error})
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  news: [],
  loading: true,
  error: null
}
export default function newsReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

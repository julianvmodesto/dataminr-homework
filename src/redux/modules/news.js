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
  payload: {
    loading: true
  },
  error
})

export const getNews = (topTerms: Array): Function => {
  return (dispatch: Function, getState: Function): Promise => {
    dispatch(newsStart())

    dispatch(newsComplete(['test']))

    return Promise.resolve()
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
  [NEWS_ERROR]: (state: Object, action: {error: string}): Object => Object.assign({}, state, action.error)
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  news: [],
  loading: false,
  error: null
}
export default function newsReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

import Cookies from 'js-cookie'

const REQUEST_TOKEN_COOKIE = 'REQUEST_TOKEN_COOKIE'
const ACCESS_TOKEN_COOKIE = 'ACCESS_TOKEN_COOKIE'

export function storeRequestToken (val) {
  Cookies.set(REQUEST_TOKEN_COOKIE, JSON.stringify(val), {
    expires: 14,
    path: '/'
  })
}

export function getRequestToken () {
  return Cookies.getJSON('REQUEST_TOKEN_COOKIE')
}

export function removeRequestToken () {
  Cookies.remove(REQUEST_TOKEN_COOKIE, {
    path: '/'
  })
}

export function storeAccessToken (val) {
  Cookies.set(ACCESS_TOKEN_COOKIE, JSON.stringify(val), {
    expires: 14,
    path: '/'
  })
}

export function getAccessToken () {
  return Cookies.getJSON('ACCESS_TOKEN_COOKIE')
}

export function removeAccessToken () {
  Cookies.remove(ACCESS_TOKEN_COOKIE, {
    path: '/'
  })
}

export function clean () {
  removeRequestToken()
  removeAccessToken()
}

// This is a react-router enter hook to catch redirects to Home
export function requireAuth (nextState, replace) {
  if (!getAccessToken()) {
    if (!getRequestToken()) {
      console.log('Missing request token')
      replace('/')
    } else if (!nextState.location.query.oauth_token || !nextState.location.query.oauth_verifier) {
      console.log('Missing oauth callback query params')
      replace('/')
    }
  }
}

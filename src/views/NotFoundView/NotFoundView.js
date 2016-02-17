import React from 'react'
import { Link } from 'react-router'

export class NotFoundView extends React.Component {
  render () {
    return (
      <div className='container text-center'>
        <h1>404 Not Found</h1>
        <hr />
        <Link to='/'>Back To Home</Link>
      </div>
    )
  }
}

export default NotFoundView

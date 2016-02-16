import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from '../../redux/modules/auth'
import classes from './HomeView.scss'
import { RaisedButton } from 'material-ui'
import { bindActionCreators } from 'redux'

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter: state.counter
})
const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatch,
  ...authActions
}, dispatch)
export class HomeView extends React.Component {
  static propTypes = {
    requestRequestToken: PropTypes.func.isRequired
  }

  // TODO: separate views into smart and dumb components
  render () {
    return (
      <div className='container text-center'>
        <h1>Welcome to Tweetstat</h1>
        <RaisedButton
          label='Authorize on Twitter'
          onClick={this.props.requestRequestToken} />
        <br />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)

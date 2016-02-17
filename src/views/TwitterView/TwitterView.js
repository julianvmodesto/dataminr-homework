import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from '../../redux/modules/auth'
import { actions as twitterActions } from '../../redux/modules/twitter'
import { bindActionCreators } from 'redux'
import Timeline from '../../components/Timeline'

const mapStateToProps = (state) => ({
  screenName: state.twitter.screenName,
  tweets: state.twitter.tweets
})
const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatch,
  ...authActions,
  ...twitterActions
}, dispatch)
export class TwitterView extends React.Component {
  static propTypes = {
    requestAccessToken: PropTypes.func.isRequired,
    getCredentials: PropTypes.func.isRequired,
    getTweets: PropTypes.func.isRequired,
    tweets: PropTypes.arrayOf(PropTypes.string).isRequired,
    screenName: PropTypes.string
  }

  componentWillMount () {
    this.props.requestAccessToken()
      .then(() => this.props.getCredentials())
      .then(() => this.props.getTweets())
  }

  render () {
    return (
      <div className='container text-center'>
        <h1>@{this.props.screenName}</h1>
        <br />
        <h3>Your Twitter Lexicon</h3>
        <br />
        <div className='row'>
          <div className='col-md-6 text-center'>
            <Timeline tweets={this.props.tweets} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitterView)

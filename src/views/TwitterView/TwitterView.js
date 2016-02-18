import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from '../../redux/modules/auth'
import { actions as twitterActions } from '../../redux/modules/twitter'
import { actions as newsActions } from '../../redux/modules/news'
import { bindActionCreators } from 'redux'
import Timeline from '../../components/Timeline'
import Terms from '../../components/Terms'

const mapStateToProps = (state) => ({
  screenName: state.twitter.screenName,
  tweets: state.twitter.tweets,
  topTerms: state.twitter.topTerms
})
const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatch,
  ...authActions,
  ...twitterActions,
  ...newsActions
}, dispatch)
export class TwitterView extends React.Component {
  static propTypes = {
    requestAccessToken: PropTypes.func.isRequired,
    getCredentials: PropTypes.func.isRequired,
    getTweets: PropTypes.func.isRequired,
    tweets: PropTypes.arrayOf(PropTypes.string).isRequired,
    screenName: PropTypes.string,
    topTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
    getNews: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.requestAccessToken()
      .then(() => this.props.getCredentials())
      .then(() => this.props.getTweets())
      .then(() => this.props.getNews())
  }

  render () {
    return (
      <div className='container'>
        <h1 className='text-center'>Your Twitter Lexicon</h1>
        <br />
        <div className='row'>
          <div className='col-md-6'>
            <Terms terms={this.props.topTerms}/>
          </div>
          <div className='col-md-6'>
            <Timeline tweets={this.props.tweets} screenName={this.props.screenName} />
          </div>
        </div>
        <br />
        <hr />
        <br />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitterView)

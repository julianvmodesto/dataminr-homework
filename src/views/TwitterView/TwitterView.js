import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from '../../redux/modules/auth'
import { actions as twitterActions } from '../../redux/modules/twitter'
import { actions as newsActions } from '../../redux/modules/news'
import { bindActionCreators } from 'redux'
import Timeline from '../../components/Timeline'
import Terms from '../../components/Terms'
import CircularProgress from 'material-ui/lib/circular-progress'
import classes from './TwitterView.scss'

const mapStateToProps = (state) => ({
  screenName: state.twitter.screenName,
  tweets: state.twitter.tweets,
  tweetsLoading: state.twitter.tweetsLoading,
  topTerms: state.twitter.topTerms,
  topTermsLoading: state.twitter.topTermsLoading,
  news: state.news.news,
  newsLoading: state.news.loading
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
    screenName: PropTypes.string,
    getTweets: PropTypes.func.isRequired,
    tweets: PropTypes.arrayOf(PropTypes.string).isRequired,
    tweetsLoading: PropTypes.bool.isRequired,
    getTopTerms: PropTypes.func.isRequired,
    topTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
    topTermsLoading: PropTypes.bool.isRequired,
    getNews: PropTypes.func.isRequired,
    news: PropTypes.arrayOf(PropTypes.array).isRequired,
    newsLoading: PropTypes.bool.isRequired
  }

  componentWillMount () {
    this.props.requestAccessToken()
      .then(() => this.props.getCredentials())
      .then(() => this.props.getTweets())
      .then((tweets) => this.props.getTopTerms(tweets))
      .then((topTerms) => this.props.getNews(topTerms))
  }

  render () {
    let content
    if (this.props.tweetsLoading || this.props.topTermsLoading) {
      content = (<div className={classes.progress}><CircularProgress /></div>)
    } else {
      content = (<div className='row'>
        <div className='col-md-6'>
          <Terms terms={this.props.topTerms} news={this.props.news}/>
        </div>
        <div className='col-md-6'>
          <Timeline tweets={this.props.tweets} screenName={this.props.screenName} />
        </div>
      </div>)
    }

    return (
      <div className='container'>
        <h1 className='text-center'>Your Twitter Lexicon</h1>
        <br />
        {content}
        <br />
        <hr />
        <br />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitterView)

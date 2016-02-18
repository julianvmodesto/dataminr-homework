import React, { PropTypes } from 'react'
import TweetEmbed from 'babel!react-tweet-embed'
import classes from './Timeline.scss'

export class Timeline extends React.Component {
  static propTypes = {
    tweets: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  static defaultProps = {
    tweets: []
  }

  render () {
    return (<div className={classes.timeline}>
      <div className='text-center'>
      {this.props.tweets.map((tweet) => <TweetEmbed key={tweet} id={tweet} />)
      }
      </div>
    </div>)
  }
}

export default Timeline

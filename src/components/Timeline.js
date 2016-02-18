import React, { PropTypes } from 'react'
import TweetEmbed from 'babel!react-tweet-embed'
import classes from './Timeline.scss'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'

export class Timeline extends React.Component {
  static propTypes = {
    tweets: PropTypes.arrayOf(PropTypes.string).isRequired,
    screenName: PropTypes.string.isRequired
  }

  static defaultProps = {
    tweets: [],
    screenName: ''
  }

  render () {
    return (<Card>
      <CardHeader
        title={'Your Timeline'}
        subtitle={'@' + this.props.screenName}
        className='text-center'
      />
      <div className={classes.timeline}>
        <br />
        <br />
        {this.props.tweets.map((tweet) => <TweetEmbed key={tweet} id={tweet} />)}
        <br />
      </div>
    </Card>)
  }
}

export default Timeline

import React, { PropTypes } from 'react'
import classes from './Terms.scss'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import CardActions from 'material-ui/lib/card/card-actions'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import ActionInfo from 'material-ui/lib/svg-icons/action/info'
import Avatar from 'material-ui/lib/avatar'
import styles from 'material-ui/lib/styles'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import CircularProgress from 'material-ui/lib/circular-progress'

export class Terms extends React.Component {

  static propTypes = {
    terms: PropTypes.arrayOf(PropTypes.object).isRequired,
    news: PropTypes.arrayOf(PropTypes.array).isRequired
  }

  static defaultProps = {
    terms: [],
    news: []
  }

  constructor (props) {
    super(props)
    this.state = {
      open: false,
      term: 'N/A',
      termIndex: -1
    }
  }

  openDialog = (term, termIndex) => {
    this.setState({open: true, term, termIndex})
  }

  closeDialog = () => {
    this.setState({open: false})
  }

  render () {
    const actions = [
      <FlatButton
        label='Close'
        primary
        keyboardFocused
        onTouchTap={this.closeDialog}
      />
    ]

    // Get news for term and display in the dialog
    let dialogNews
    // Check that the news has been loaded
    if (this.state.termIndex !== -1 &&
      this.props.terms.length > 0 && this.props.news.length === this.props.terms.length) {
      dialogNews = (<div>
        <p className='help-block'>Are you tweeting about cool ish?</p>
        <p>
          <strong>We tried searching for matching news articles from The New York Times.</strong>
        </p>
        {this.props.news[this.state.termIndex].map((doc) => {
          try {
            return (<Card key={doc._id}>
              <CardHeader
                title={doc.headline.main}
                subtitle={doc.byline.original}
                actAsExpander
                showExpandableButton
              />
              <CardText expandable>
                <p>{doc.snippet}</p>
              </CardText>
              <CardActions expandable>
                <FlatButton
                  label='Open Article'
                  linkButton
                  href={doc.web_url}
                  target='_blank'
                  />
              </CardActions>
            </Card>)
          } catch (e) {
            // In case any doc properties don't exist, don't render this Card
            return <span></span>
          }
        })}
      </div>)
    } else {
      // Show a loading indicator if the news hasn't been loaded
      dialogNews = <div className={classes.progress}><CircularProgress /></div>
    }

    return (<Card>
      <CardHeader
        title={'Your Top ' + this.props.terms.length + ' Terms'}
        subtitle='from most to least frequent'
        className='text-center'
      />
      <List>
      {this.props.terms.map((term, index) => {
        return (<ListItem
          key={term.word}
          primaryText={term.word}
          leftAvatar={<Avatar backgroundColor={styles.Colors.cyan500}>{index + 1}</Avatar>}
          rightIcon={<ActionInfo />}
          onTouchTap={() => this.openDialog(term.word, index)}
          />)
      })}
        <Dialog
          title={this.state.term}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.closeDialog}
          autoScrollBodyContent
        >
        {dialogNews}
        </Dialog>
      </List>
    </Card>)
  }
}

export default Terms

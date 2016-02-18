import React, { PropTypes } from 'react'
import classes from './Terms.scss'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
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
    if (this.state.termIndex !== -1 &&
      this.props.terms.length > 0 && this.props.news.length === this.props.terms.length) {
      dialogNews = this.props.news[this.state.termIndex].map((doc) => {
        return (<p key={doc._id}>{doc.headline.main}</p>)
      })
    } else {
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
        >
        {dialogNews}
        </Dialog>
      </List>
    </Card>)
  }
}

export default Terms

import React, { PropTypes } from 'react'
import classes from './Terms.scss'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import ActionInfo from 'material-ui/lib/svg-icons/action/info'
import Avatar from 'material-ui/lib/avatar'
import styles from 'material-ui/lib/styles';

export class Terms extends React.Component {

  static propTypes = {
    terms: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  static defaultProps = {
    terms: []
  }

  render () {
    return (<Card className={classes.terms}>
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
          />)
      })}
      </List>
    </Card>)
  }
}

export default Terms

import React, { PropTypes } from 'react'

export class Terms extends React.Component {

  static propTypes = {
    terms: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  static defaultProps = {
    terms: []
  }

  // http://stackoverflow.com/a/12646864/1881379
  shuffleArray (array) {
    let ret = array.slice()
    for (let i = ret.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = ret[i]
      ret[i] = ret[j]
      ret[j] = temp
    }
    return ret
  }

  render () {
    return (<div className=''>
      <div className='text-center'>
        {this.shuffleArray(this.props.terms).map((term) => <p key={term.word}>{term.word}</p>)}
      </div>
    </div>)
  }
}

export default Terms

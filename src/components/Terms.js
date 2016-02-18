import React, { PropTypes } from 'react'

export class Terms extends React.Component {

  static propTypes = {
    terms: PropTypes.arrayOf(PropTypes.array).isRequired
  }
  static defaultProps = {
    terms: []
  }

  // http://stackoverflow.com/a/12646864/1881379
  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  componentWillMount () {
    this.shuffleArray(this.props.terms)
    console.log(this.props.terms)
  }

  render () {
    return (<div className=''>
      <div className='text-center'>
        {this.props.terms.map((term) => <p key={term[0]}>{term[0]}</p>)}
      </div>
    </div>)
  }
}

export default Terms

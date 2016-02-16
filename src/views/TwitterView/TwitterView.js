import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from '../../redux/modules/auth'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
})
const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatch,
  ...authActions
}, dispatch)
export class TwitterView extends React.Component {
  static propTypes = {
    requestAccessToken: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.requestAccessToken()
  }

  render () {
    return (
      <div className='container text-center'>
        <h1>Twitter View</h1>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitterView)

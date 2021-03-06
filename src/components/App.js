import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {google_analytics, request} from '../utils'
import Error from './shared/Error'
import Contractors from './contractors/Contractors'
import PlainEnquiry from './enquiry/PlainEnquiry'
import EnquiryButton from './enquiry/EnquiryButton'
import Appointments from './appointments/Appointments'

class App extends Component {
  constructor (props) {
    super(props)
    this.ga_prefixes = google_analytics(props.history, props.config)
    this.state = {
      error: props.error,
      enquiry_form_info: null,
    }
    this.url = props.url_generator

    this.ga_event = this.ga_event.bind(this)
    this.request = request.bind(this)
    this.requests = {
      get: (path, args, config) => {
        config = config || {}
        config.args = args
        return this.request('GET', path, config)
      },
      post: (path, data, config) => {
        config = config || {}
        config.send_data = data
        config.expected_statuses = config.expected_statuses || [201]
        return this.request('POST', path, config)
      }
    }
  }

  get_enquiry () {
    if (this.state.enquiry_form_info === null) {
      this.set_enquiry()
    }
    return this.state.enquiry_form_info || {}
  }

  async set_enquiry () {
    this.setState({enquiry_form_info: {}})
    const enquiry_form_info = await this.requests.get('enquiry')
    this.props.config.event_callback('get_enquiry_data', enquiry_form_info)
    this.setState({enquiry_form_info})
  }

  ga_event (category, action, label) {
    /* istanbul ignore next */
    for (let prefix of this.ga_prefixes) {
      console.debug('ga sending event', prefix, category, action, label)
      window.ga(prefix + 'send', 'event', category, action, label)
    }
  }

  render () {
    if (this.state.error) {
      return <Error>{this.state.error}</Error>
    } else if (this.props.config.mode === 'enquiry') {
      return <PlainEnquiry root={this} config={this.props.config}/>
    } else if (this.props.config.mode === 'enquiry-modal') {
      return <EnquiryButton root={this} config={this.props.config}/>
    } else if (this.props.config.mode === 'appointments') {
      return <Appointments root={this} config={this.props.config} history={this.props.history}/>
    } else {
      // grid or list
      return <Contractors root={this} config={this.props.config} history={this.props.history}/>
    }
  }
}

export default withRouter(App)

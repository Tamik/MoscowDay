import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ListCard } from 'atoms'

import MDApi from 'utils/MDApi'

export default class EventsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.event.id,
      type: props.event.type,
      isModalVisible: false,
      title: null,
      events: [],
    }

    this.openEventViewModal = this.openEventViewModal.bind(this)
    this.closeEventViewModal = this.closeEventViewModal.bind(this)
  }

  componentDidMount() {
    switch (this.state.type) {
      case 'place': MDApi.getEvents({
        place: this.state.id,
      }).then((response) => {
        return response.json()
      }).then((response) => {
        this.setState({
          events: response.data,
        })
      })
        break
      case 'headings': MDApi.getEvents({
        category: this.state.id,
      }).then((response) => {
        return response.json()
      }).then((response) => {
        this.setState({
          events: response.data,
        })
      })
        break
      default: break
    }
  }

  openEventViewModal(payload) {
    this.setState({
      isModalVisible: true,
      data: payload,
    })
  }

  closeEventViewModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div>
        {this.state.events.map(item => (
          <ListCard key={item.id} {...item} />
        ))}
      </div>
    )
  }
}

EventsList.propTypes = {
  place: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
  })
}

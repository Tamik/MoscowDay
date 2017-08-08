import React, { Component } from 'react'
import ReactModal from 'react-modal'

import ListCard from 'atoms/ListCard'

import MDApi from 'utils/MDApi'

export default class EventsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEventModalVisible: false,
      title: null,
      categoryId: props.category,
      events: [],
    }

    this.openEventViewModal = this.openEventViewModal.bind(this)
    this.closeEventViewModal = this.closeEventViewModal.bind(this)
  }

  componentDidMount() {
    MDApi.getEvents({
      category: this.state.categoryId,
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          events: response.data,
        })
      })
  }

  openEventViewModal(payload) {
    this.setState({
      isEventModalVisible: true,
      data: payload,
    })
  }

  closeEventViewModal() {
    this.setState({
      isEventModalVisible: false,
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

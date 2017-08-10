import React, { Component } from 'react'

import Modal from 'components/modals/Modal'

import MDApi from 'utils/MDApi'

export default class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: false,
      modalTitle: null,
      events: [],
    }

    this.openEventsViewModal = this.openEventsViewModal.bind(this)
    this.closeEventsViewModal = this.closeEventsViewModal.bind(this)
  }

  componentDidMount() {
    MDApi.getEvents({
      is_main: 1,
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

  openEventsViewModal(title, id) {
    this.setState({
      id: id,
      type: 'events',
      isModalVisible: true,
      modalTitle: title
    })
  }

  closeEventsViewModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div>
        {this.state.events.map(event => (
          <h2
            key = {event.id}
            onClick = {() => this.openEventsViewModal(event.title, event.id)}
          >
            {event.title}
          </h2>
        ))}

        <Modal
          isOpen = {this.state.isModalVisible}
          title = {this.state.modalTitle || ''}
          content = {<p>Plotva</p>}
          close = {this.closeEventsViewModal}
        />
      </div>
    )
  }
}

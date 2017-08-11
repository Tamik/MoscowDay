import React, { Component } from 'react'
import localforage from 'localforage'

import Modal from 'components/modals/Modal'

import { Modal } from 'components/modals'

import MDApi from 'utils/MDApi'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

export default class Timeline extends Component {
  state = {
    isModalVisible: false,
    modalTitle: null,
    events: [],
    payload: {},
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
  openEventsModal = (id, title, payload) => {
    this.setState({
      id: id,
      type: 'events',
      isModalVisible: true,
      modalTitle: title,
      payload: payload,
    })
  }

  closeEventsViewModal() {
  closeEventsModal = () => {
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
          isOpen={this.state.isModalVisible}
          title={this.state.modalTitle || ''}
          content={
            <div style={{ margin: 16 }}>
              <h1 style={{ marginBottom: 2 }}>{this.state.payload.title}</h1>
              <span style={{ display: 'block', marginBottom: 16, opacity: 0.25 }}>{this.state.payload.location_title}</span>
              <p style={{ marginBottom: 16 }}>{this.state.payload.description}</p>
            </div>
          }
          close={this.closeEventsModal}
        />
      </div>
    )
  }
}

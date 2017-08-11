import React, { Component } from 'react'
import localforage from 'localforage'


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
    inFavorites: false,
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

  openEventsModal = (id, title, payload) => {
    this.setState({
      id: id,
      type: 'events',
      isModalVisible: true,
      modalTitle: title,
      payload: payload,
    })
    this.inFavorites(id)
  }

  closeEventsModal = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  addToFavorites = (id, value) => {
    FavoritesStore.setItem(id, value)
  }

  removeFromFavorites = (id) => {
    FavoritesStore.removeItem(id)
  }

  inFavorites = (id) => {
    FavoritesStore.getItem(id)
      .then((response) => {
        if (response !== null) {
          this.setState({
            inFavorites: true,
          })
          return
        }
        this.setState({
          inFavorites: false,
        })
      })
  }

  handleFavorites(id, value) {
    if (this.state.inFavorites) {
      this.removeFromFavorites(id)
    }
    else {
      this.addToFavorites(id, value)
    }
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

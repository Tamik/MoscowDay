import React, { Component } from 'react'
import localforage from 'localforage'

import { Step, Stepper, StepButton } from 'material-ui/Stepper'

import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

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
    this.setState({
      inFavorites: true,
    })
  }

  removeFromFavorites = (id) => {
    FavoritesStore.removeItem(id)
    this.setState({
      inFavorites: false,
    })
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
        <Stepper
          activeStep={0}
          linear={false}
          orientation='vertical'
        >
          {this.state.events.map(event => (
            <Step key={event.id}>
              <StepButton
                onTouchTap={() => this.openEventsModal(event.id, event.title, event)}
              >
                {event.title}
              </StepButton>
            </Step>
          ))}
        </Stepper>

        <Modal
          isOpen = {this.state.isModalVisible}
          isVisibleTopBar={false}
          content = {<EventInfo  event={this.state.payload} />}
          close = {this.closeEventsModal}
        />
      </div>
    )
  }
}

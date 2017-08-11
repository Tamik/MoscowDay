import React, { Component } from 'react'

import localforage from 'localforage'

import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import { Modal } from 'components/modals'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const style = {
  // height: 200,
  margin: 10,
}

export default class Favorites extends Component {
  state = {
    id: null,
    isModalVisible: false,
    favorites: [],
    modalTitle: null,
    payload: {},
  }

  handleOpenModal = (id, title, payload) => {
    this.setState({
      id: id,
      isModalVisible: true,
      modalTitle: title,
      payload: payload,
    })
  }

  handleCloseModal = () => {
    this.setState({
      isModalVisible: false,
    })
  }
  render() {
    return (
      <div>
        <AppBar title='Избранное' showMenuIconButton={false} />
        <Paper style={style} zDepth={1}>
          {this.state.favorites.map(event => (
            <Card
              key={event.id}
            >
              <CardTitle title={event.title} subtitle={event.location_title} />
            </Card>
          ))}
        </Paper>
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
          close={this.handleCloseModal}
        />
      </div>
    )
  }
}

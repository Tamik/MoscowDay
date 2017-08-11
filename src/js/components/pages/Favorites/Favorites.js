import React, { Component } from 'react'

import localforage from 'localforage'

import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Star from 'material-ui/svg-icons/toggle/star'
import EmptyStar from 'material-ui/svg-icons/toggle/star-border'

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

  componentDidMount() {
    FavoritesStore.keys()
      .then((response) => {
        response.map((id) => {
          FavoritesStore.getItem(id)
            .then((event) => {
              const tempState = this.state.favorites
              tempState.push(event)
              this.setState({
                favorites: tempState,
              })
              return event
            })
        })
        return response
      })
  }

  handleOpenModal = (id, title, payload) => {
    this.setState({
      id: id,
      isModalVisible: true,
      modalTitle: title,
      payload: payload,
    })
    this.inFavorites(id)
  }

  handleCloseModal = () => {
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
        <AppBar title='Избранное' showMenuIconButton={false} />
        <Paper style={style} zDepth={1}>
          {this.state.favorites.length !== 0 ? this.state.favorites.map(event => (
            <Card
              key={event.id}
              onTouchTap={() => this.handleOpenModal(event.id, event.title, event)}
            >
              <CardTitle title={event.title} subtitle={event.location_title} />
            </Card>
          ))
            : <Card
              key='notevents'
            >
              <CardTitle title='Пусто!' subtitle='Добавьте что-нибудь в избранное. ;)' />
            </Card>
          }
        </Paper>
        <Modal
          isOpen={this.state.isModalVisible}
          title={this.state.modalTitle || ''}
          content={
            <div style={{ margin: 16 }}>
              <h1 style={{ marginBottom: 2 }}>{this.state.payload.title}</h1>
              <span style={{
                display: 'block',
                marginBottom: 16,
                opacity: 0.25,
              }}
              >
                {this.state.payload.location_title}
              </span>
              <p style={{ marginBottom: 16 }}>{this.state.payload.description}</p>
              <IconButton
                onTouchTap={() => this.handleFavorites(this.state.payload.id, this.state.payload)}
              >
                {this.state.inFavorites ? <Star /> : <EmptyStar />}
              </IconButton>
            </div>
          }
          close={this.handleCloseModal}
        />
      </div>
    )
  }
}

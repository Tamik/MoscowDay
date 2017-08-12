import React, { Component } from 'react'

import localforage from 'localforage'

import { EventInfo } from 'atoms'
import { TopBar } from 'molecules'
import Paper from 'material-ui/Paper'
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import styled from 'styled-components'

import IconButton from 'material-ui/IconButton'
import Star from 'material-ui/svg-icons/toggle/star'
import EmptyStar from 'material-ui/svg-icons/toggle/star-border'

import { Modal } from 'components/modals'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #cfd8dc;
`
const TopBarWrap = styled.div``
const ContentWrap = styled.div`
  flex: 1;
  padding: 5px;
`
const CardWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`
const Title = styled.h2`
  height: 55px;
  margin-bottom: 10px;
  color: #000;
  font-size: 16px;
  font-weight: normal;
  overflow: hidden;
`
const Text = styled.p`
  font-size: 14px;
  color: #000;
`

const style = {
  borderRadius: 0,
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
        this.reRenderFavorites(response)
      })
  }

  reRenderFavorites = (eventKeys) => {
    const events = []

    if (eventKeys.length === 0) {
      this.setState({
        favorites: events,
      })
      return
    }

    eventKeys.map((id) => {
      FavoritesStore.getItem(id)
        .then((item) => {
          events.push(item)
          this.setState({
            favorites: events,
          })
        })
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
      .then(() => {
        this.setState({
          inFavorites: true,
        })
      })
      .then(() => {
        FavoritesStore.keys()
          .then((response) => {
            this.reRenderFavorites(response)
          })
      })
  }

  removeFromFavorites = (id) => {
    FavoritesStore.removeItem(id)
      .then(() => {
        this.setState({
          inFavorites: false,
        })
      })
      .then(() => {
        FavoritesStore.keys()
          .then((response) => {
            this.reRenderFavorites(response)
          })
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
      <PageContent>
        <TopBarWrap>
          <TopBar
            title='Избранные события'
            isVisible
            showButton={false}
          />
        </TopBarWrap>
        <ContentWrap>
          <Paper style={style} zDepth={0}>
            {this.state.favorites.length !== 0 ? this.state.favorites.map(event => (
              <Card
                containerStyle={{display: 'flex', padding: 0}}
                key={event.id}
                onTouchTap={() => this.handleOpenModal(event.id, event.title, event)}
              >
                <CardMedia>
                  <img src='//placehold.it/100x110' width='100' height='110'/>
                </CardMedia>

                <CardWrap>
                  <Title>{event.title}</Title>
                    <Text>{event.dateFormatted.time}, {event.dateFormatted.day} {event.dateFormatted.month}</Text>
                </CardWrap>
              </Card>
            ))
              : <Card
                key='notevents'
              >
                <CardTitle title='Пусто!' subtitle='Добавьте что-нибудь в избранное. ;)' />
              </Card>
            }
          </Paper>
        </ContentWrap>

        <Modal
          isOpen={this.state.isModalVisible}
          content={<EventInfo event={this.state.payload} />}
          close={this.handleCloseModal}
        />
      </PageContent>
    )
  }
}

import React, { Component } from 'react'

import localforage from 'localforage'

import { EventInfo } from 'atoms'
import { TopBar } from 'molecules'
import Paper from 'material-ui/Paper'
import { Card, CardTitle} from 'material-ui/Card'
import styled from 'styled-components'

import { Modal } from 'components/modals'
import { ListCard } from 'atoms'
const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`
const TopBarWrap = styled.div``
const ContentWrap = styled.div`
  flex: 1;
  padding: 5px;
`

const style = {
  borderRadius: 0,
  backgroundColor: 'transparent'
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
        <ContentWrap style={{backgroundColor: '#e7ebec'}}>
          <Paper style={style} zDepth={0}>
            {this.state.favorites.length !== 0 ? this.state.favorites.map(event => (
              <ListCard key={event.id} event={event} />
            ))
              : <Card
                key='notevents'
              >
                <CardTitle title='Пусто!' subtitle='Добавьте что-нибудь в избранное. ;)' />
              </Card>
            }
          </Paper>
        </ContentWrap>
      </PageContent>
    )
  }
}

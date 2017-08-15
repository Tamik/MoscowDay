import React, { Component } from 'react'
import styled from 'styled-components'
import localforage from 'localforage'

import Paper from 'material-ui/Paper'
import { Card, CardTitle } from 'material-ui/Card'

import { ListCard } from 'atoms'
import { TopBar } from 'molecules'

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
  backgroundColor: 'transparent',
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
            showButton={false}
            isVisible
          />
        </TopBarWrap>
        <ContentWrap style={{
          backgroundColor: '#e7ebec',
        }}
        >
          {this.state.favorites.length !== 0
            ? this.state.favorites.map(event => (
              <Paper style={style} zDepth={0}>
                <ListCard key={event.id} event={event} parent={this} />
              </Paper>
            ))
            : <p
              key='notevents'
              style={{
                textAlign: 'center',
                paddingTop: 20,
                color: '#455A64',
              }}
            >Вы ещё ничего не добавили <br /> в избранное</p>

          }
        </ContentWrap>
      </PageContent>
    )
  }
}

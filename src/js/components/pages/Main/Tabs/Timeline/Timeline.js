import React, { Component } from 'react'
import localforage from 'localforage'

import styled from 'styled-components'

import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

import MDApi from 'utils/MDApi'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const List = styled.ul`
  
`
const ListItem = styled.li`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 10px;
  color: #607D8B;
  border-bottom: 1px solid rgba(207, 216, 220, 0.35);
`
const Title = styled.p`
  font-size: 12pt;
  line-height: 1.05em;
  font-weight: normal;
`
const Time = styled.p`
  color: #455A64;
`
const Line = styled.div`
  flex: 0 0 9px;
  height: 9px;
  margin: 0 20px;
  border: 1px solid #607D8B;
  border-radius: 50%;
`
export default class Timeline extends Component {
  state = {
    isModalVisible: false,
    modalTitle: null,
    events: [],
    payload: {},
    inFavorites: false,
  }

  componentDidMount() {
    const date = new Date()
    const month = '0'.concat(date.getMonth() + 1).slice(-2)
    const day = '0'.concat(date.getDate()).slice(-2)

    MDApi.getEvents({
      is_main: 1,
      date: `${date.getFullYear()}-${month}-${day}`,
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
        <List>
          {this.state.events.map(event => (
            <ListItem
              key={event.id}
              className='timelineItem'
              onClick={() => this.openEventsModal(event.id, event.title, event)}
            >

              <Time
                style={
                  event.is_bold
                  ? {fontWeight: 'bold',}
                  : null
                }
              >
                {event.dateFormatted.time}
              </Time>
              <Line
                className='timelineLine'
                style={
                  event.is_bold
                    ? {backgroundColor: '#607D8B',}
                    : null
                }
              >
              </Line>
              <Title
                style={
                  event.is_bold
                    ? {fontWeight: 'bold',color: '#263238',}
                    : null
                }
              >{event.title}</Title>
            </ListItem>
          ))}
        </List>
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

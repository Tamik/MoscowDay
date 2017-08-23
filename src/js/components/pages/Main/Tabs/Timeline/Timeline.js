import React, { Component } from 'react'
import styled from 'styled-components'
import localforage from 'localforage'

import LinearProgress from 'material-ui/LinearProgress'

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
  display: block;
  height: 100%;
  font-size: 12pt;
  line-height: 1.05em;
  font-weight: normal;
  overflow-y: hidden;
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
    loading: true,
  }

  componentDidMount() {
    const today = MDApi.getTodayMSK()

    MDApi.getEvents({
      is_main: 1,
      date: `${today.year}-${today.month}-${today.date}`,
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          events: response.data,
          loading: false,
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

  render() {
    return (
      <div>
        {this.state.loading
          ? <LinearProgress
            mode='indeterminate'
            style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          : ''
        }
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
                    ? {
                      fontWeight: 'bold',
                    }
                    : null
                }
              >
                {event.dateFormatted.time}
              </Time>
              <Line
                className='timelineLine'
                style={
                  event.is_bold
                    ? {
                      backgroundColor: '#607D8B',
                    }
                    : null
                }
              />
              <Title
                style={
                  event.is_bold
                    ? {
                      fontWeight: 'bold',
                      color: '#263238',
                    }
                    : null
                }
              >{
                (event.title.length > 60)
                ? event.title.substr(0, 60) + '&hellip;'
                : event.title
              }</Title>
            </ListItem>
          ))}
        </List>
        <Modal
          isOpen={this.state.isModalVisible}
          isVisibleTopBar={false}
          content={<EventInfo event={this.state.payload} />}
          close={this.closeEventsModal}
        />
      </div>
    )
  }
}

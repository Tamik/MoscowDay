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
  padding: 10px;
  border-bottom: 1px solid rgba(207, 216, 220, 0.35);
  overflow: hidden;
`
const Title = styled.div`
  display: block;
  height: 100%;
  line-height: 1.2em;
  font-weight: normal;
  overflow-y: hidden;
`
const TitleText = styled.p`
  font-size: 16px;
  color: rgb(38, 50, 56);
`
const Time = styled.p`
  margin-top: 6px;
  color: #607D8B;
  font-size: 90%;
  font-weight: normal;
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
      items_per_page: 50,
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
          {this.state.events.map((event) => {
            const beautyDatesRange = MDApi.beautifyEventDatesRange(
              event.dateFormatted,
              event.dateEndFormatted
            )
            return (
              <ListItem
                key={event.id}
                className='timelineItem'
                onClick={() => this.openEventsModal(event.id, event.title, event)}
              >
                <Line
                  className='timelineLine'
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
                >
                  <TitleText>{event.title}</TitleText>
                  <Time>{beautyDatesRange.dates} ({beautyDatesRange.time})</Time>
                </Title>
              </ListItem>
            )
          }
          )}
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

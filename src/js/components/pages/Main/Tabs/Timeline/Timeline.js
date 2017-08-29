import React, { Component } from 'react'
import styled from 'styled-components'
import localforage from 'localforage'

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
  position: relative;
  padding: 10px;
  overflow: hidden;
`
const Title = styled.div`
  display: block;
  font-weight: normal;
  height: 100%;
  line-height: 1.2em;
  overflow-y: hidden;
`
const TitleText = styled.p`
  font-size: 16px;
  color: rgba(38, 50, 56, 1);
`
const Time = styled.p`
  font-size: 90%;
  font-weight: normal;
  margin-top: 6px;
  color: #607D8B;
`
const Line = styled.div`
  flex: 0 0 9px;
  border: 1px solid #607D8B;
  border-radius: 50%;
  height: 9px;
  margin: 0 20px;
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
      .catch(() => {
        window.plugins.toast.showWithOptions({
          message: 'Упс, подключитесь к Интернету',
          duration: 'short',
          position: 'bottom',
          styling: {
            opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
            backgroundColor: 'rgb(96, 125, 139)', // make sure you use #RRGGBB. Default #333333
            textColor: '#ffffff', // Ditto. Default #FFFFFF
            textSize: 20.5, // Default is approx. 13.
            cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
            horizontalPadding: 20, // iOS default 16, Android default 50
            verticalPadding: 16, // iOS default 12, Android default 30
          },
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
          ? <div className='simple-spinner'>
            <div className='simple-spinner__bounce1' />
            <div className='simple-spinner__bounce2' />
          </div>
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

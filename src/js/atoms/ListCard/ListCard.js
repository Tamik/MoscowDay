import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import localforage from 'localforage'

import { Card, CardMedia } from 'material-ui/Card'

import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

import MDApi from 'utils/MDApi'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const CardWrap = styled.div`
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  justify-content: space-between;
  -webkit-box-pack: center;
  -webkit-justify-content: space-between;
  flex: 1;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  padding: 10px;
`
const Title = styled.h2`
  margin-bottom: 10px;
  color: rgb(38, 50, 56);
  font-size: 16px;
  font-weight: normal;
`
const DatesLabel = styled.p`
  font-size: 14px;
  color: rgb(69, 90, 100);
`
const TimeLabel = styled.p`
  font-size: 13px;
  color: #888;
`

export default class ListCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      isModalVisible: false,
      favorites: [],
      modalTitle: null,
      payload: {},
    }
  }

  openEventsViewModal = () => {
    this.setState({
      isModalVisible: true,
    })
  }

  closeEventsViewModal = () => {
    if (window.location.hash === '#/favorites') {
      FavoritesStore.keys()
        .then(response => this.props.parent.reRenderFavorites(response))
        .then(() => this.setState({
          isModalVisible: false,
        }))
    }
    else {
      this.setState({
        isModalVisible: false,
      })
    }
  }

  render() {
    const beautyDatesRange = MDApi.beautifyEventDatesRange(
      this.props.event.dateFormatted,
      this.props.event.dateEndFormatted
    )
    return (
      <div>
        <Card
          containerStyle={{
            display: 'flex',
            display: '-webkit-box',
            display: '-webkit-flex',
            padding: 0,
            marginBottom: 5,
          }}

          onClick={() => this.openEventsViewModal()}
        >
          <CardMedia
            style={{
              // height: 110,
              width: 100,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${process.env.API_HOST}/i/events/${this.props.event.id}_small.jpg)`,
            }}
          />
          <CardWrap>
            <Title>{this.props.event.title}</Title>
            <DatesLabel>{beautyDatesRange.dates}</DatesLabel>
            <TimeLabel>{beautyDatesRange.time}</TimeLabel>
          </CardWrap>
        </Card>
        <Modal
          isOpen={this.state.isModalVisible}
          isVisibleTopBar={false}
          content={<EventInfo event={this.props.event} />}
          close={this.closeEventsViewModal}
        />
      </div>
    )
  }
}

// ListCard.propTypes = {
//   event: PropTypes.shape({})
// }

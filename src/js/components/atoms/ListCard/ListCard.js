import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import localforage from 'localforage'

import { Card, CardMedia } from 'material-ui'

import { EventInfo } from 'components/atoms'
import { Modal } from 'components/molecules'
import { MDApi } from 'utils'

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
const EnterLabel = styled.span`
  position: absolute; 
  right: 10px;
  bottom: 10px;
  font-size: 13px;
`

export default class ListCard extends Component {
  constructor(props) {
    super(props)

    this.beautyDatesRange = MDApi.beautifyEventDatesRange(
      this.props.event.dateFormatted,
      this.props.event.dateEndFormatted
    )

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
    return (
      <div>
        <Card
          containerStyle={{
            display: 'flex',
            display: '-webkit-box',
            display: '-webkit-flex',
            marginBottom: 5,
            padding: 0,
          }}

          onClick={() => this.openEventsViewModal()}
        >
          <CardMedia
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${process.env.API_HOST}/i/events/${this.props.event.id}_small.jpg)`,
              width: 100,
            }}
          />
          <CardWrap style={{ position: 'relative' }}>
            <Title>{this.props.event.title}</Title>
            <DatesLabel>{this.beautyDatesRange.dates}</DatesLabel>
            <TimeLabel>{this.beautyDatesRange.time}</TimeLabel>
            <EnterLabel>{this.props.event.is_free ? <span style={{ color: '#8ea36a' }}>0₽</span> : ''}</EnterLabel>
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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import localforage from 'localforage'

import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

import { Card, CardMedia } from 'material-ui/Card'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

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
    return (
      <div>
        <Card
          containerStyle={{
            display: 'flex',
            padding: 0,
            marginBottom: 5,
          }}
          onTouchTap={() => this.openEventsViewModal()}
        >
          <CardMedia
            style={{
              height: '110px',
              width: '100px',
              backgroundSize: 'cover',
              backgroundImage: 'url(http://io.yamblz.ru/i/events/' + this.props.event.id + '_small.jpg)'
            }}
          />
          <CardWrap>
            <Title>{this.props.event.title}</Title>
            <Text>{this.props.event.dateFormatted.time}, {this.props.event.dateFormatted.day} {this.props.event.dateFormatted.month}</Text>
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

ListCard.propTypes = {
  event: PropTypes.shape({

  })
}

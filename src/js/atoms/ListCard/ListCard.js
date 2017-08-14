import React, { Component } from 'react'

import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

import { Card, CardMedia } from 'material-ui/Card'

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
const styles = {
  img: {
    objectFit: 'cover',
  }
}
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

    this.openEventsViewModal = this.openEventsViewModal.bind(this)
    this.closeEventsViewModal = this.closeEventsViewModal.bind(this)
  }

  openEventsViewModal() {
    this.setState({
      isModalVisible: true,
    })
  }

  closeEventsViewModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div>
        <Card
          containerStyle={{display: 'flex', padding: 0, marginBottom: 5}}
          onTouchTap={() => this.openEventsViewModal()}
        >
          <CardMedia>
            <img style={styles.img} src='//placehold.it/100x110' width='100' height='110'/>
          </CardMedia>

          <CardWrap>
            <Title>{this.props.event.title}</Title>
            <Text>{this.props.event.dateFormatted.time}, {this.props.event.dateFormatted.day} {this.props.event.dateFormatted.month}</Text>
          </CardWrap>
        </Card>

        <Modal
          isOpen = {this.state.isModalVisible}
          isVisibleTopBar = {false}
          content = {<EventInfo event = {this.props.event} />}
          close = {this.closeEventsViewModal}
        />
      </div>
    )
  }
}

ListCard.propTypes = {
  event: PropTypes.shape({

  })
}

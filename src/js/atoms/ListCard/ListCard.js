import React, { Component } from 'react'

import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

const Layout = styled.div`
  display: flex;
  color: black;
`
const Content = styled.div`
  flex: 1;
`

export default class ListCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
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
      <Layout onClick={this.openEventsViewModal}>
        <Image><img src='//placehold.it/50x60' /></Image>
        <Content>
          <h3>{this.props.title}</h3>
          <p>{this.props.begin_time}</p>
        </Content>

        <Modal
          isOpen = {this.state.isModalVisible}
          isVisibleTopBar = {false}
          content = {<EventInfo event = {this.props} />}
          close = {this.closeEventsViewModal}
        />
      </Layout>
    )
  }
}

ListCard.propTypes = {
  title: PropTypes.string.isRequired,
  begin_time: PropTypes.string.isRequired,
}

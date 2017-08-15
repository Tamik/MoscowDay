import React, { Component } from 'react'

import styled from 'styled-components'

import { Map } from 'components/map'
import { TopBar } from 'molecules'
import { Modal } from 'components/modals'
import { EventInfo } from 'atoms'

import MDApi from 'utils/MDApi'

const PageContent = styled.div`
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-grow: 1;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
`
const TopBarWrap = styled.div`
`
const MapWrap = styled.div`
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-grow: 1;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
`

export default class Radar extends Component {
  constructor(props) {
    super(props)

    this.isComponentMounted = false

    this.state = {
      events: [],
      payload: {},
      isModalVisible: false,
      modalTitle: '',
    }

    this.closeEventsModal = this.closeEventsModal.bind(this)
  }

  componentDidMount() {
    this.isComponentMounted = true

    const date = new Date()
    const month = '0'.concat(date.getMonth() + 1).slice(-2)
    const day = '0'.concat(date.getDate()).slice(-2)

    MDApi.getEvents({
      items_per_page: 500, // all on today
      /**
       * date = today
       * @todo: Решить проблему с разницей в часовых поясах
       */
      date: `${date.getFullYear()}-${month}-${day}`,
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        if (!this.isComponentMounted) {
          return
        }
        this.setState({
          events: response.data,
        })
      }).catch((err) => {
        // @todo: resolve errors
        // console.log(err)
      })
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  closeEventsModal() {
    if (!this.isComponentMounted) {
      return
    }
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <PageContent>
        <TopBarWrap>
          <TopBar
            title='События рядом'
            isVisible
            showButton={false}
          />
        </TopBarWrap>
        <MapWrap>
          <Map
            points={this.state.events}
            panToMyLocation
            sharedState={this.state}
            parent={this}
            height={'81.1vh'}
          />
          <Modal
            isOpen={this.state.isModalVisible}
            isVisibleTopBar
            title={this.state.modalTitle}
            content={<EventInfo event={this.state.payload} />}
            close={this.closeEventsModal}
          />
        </MapWrap>
      </PageContent>
    )
  }
}

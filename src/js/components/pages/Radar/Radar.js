import React, { Component } from 'react'

import styled from 'styled-components'

import { Map } from 'components/map'
import { TopBar } from 'molecules'

import MDApi from 'utils/MDApi'

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`
const TopBarWrap = styled.div`
`
const MapWrap = styled.div`
  flex-grow: 1;
`

export default class Radar extends Component {
  state = {
    events: [],
  }

  componentDidMount() {
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
        this.setState({
          events: response.data,
        })
      }).catch((err) => {
        // @todo: resolve errors
        // console.log(err)
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
            width={'100vw'}
            height={'84vh'}
            panToMyLocation
          />
        </MapWrap>
      </PageContent>
    )
  }
}

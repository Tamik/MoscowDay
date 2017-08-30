import React, { Component } from 'react'
import styled from 'styled-components'
import { HashRouter as Router, Route } from 'react-router-dom'
import localforage from 'localforage'

import { Paper } from 'material-ui'

import { NavigationBar } from 'components/molecules'
import { Main as MainScreen, Favorites as FavoritesScreen, Radar as RadarScreen } from 'components/organisms'

const MapStore = localforage.createInstance({
  name: 'Map',
})

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
`
const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export default class Application extends Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = [pos.coords.latitude, pos.coords.longitude]
        MapStore.setItem('map', {
          myLocationPoint: {
            lat: position[0],
            lng: position[1],
          },
          mapState: {
            center: position,
            zoom: 11,
          },
        })
      },
      (err) => {
        // resolve error
        const position = [55.753559, 37.609218]
        MapStore.setItem('map', {
          myLocationPoint: {
            lat: position[0],
            lng: position[1],
          },
          mapState: {
            center: position,
            zoom: 11,
          },
        })
      }, { enableHighAccuracy: false })
  }

  render() {
    return (
      <Router>
        <Layout className='ONE'>
          <ContentWrap className='TWO'>
            <Route exact path='/' component={MainScreen} />
            <Route path='/favorites' component={FavoritesScreen} />
            <Route path='/radar' component={RadarScreen} />
          </ContentWrap>
          <Paper zDepth={1} style={{ position: 'relative' }}>
            <NavigationBar />
          </Paper>
        </Layout>
      </Router>
    )
  }
}

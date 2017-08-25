import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import localforage from 'localforage'
import styled from 'styled-components'

import Paper from 'material-ui/Paper'

import { Main, Favorites, Radar } from './pages'
import { NavigationBar } from '../molecules'

const MapStore = localforage.createInstance({
  name: 'Map',
})

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: "Arial", sans-serif;
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
            <Route exact path='/' component={Main} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/radar' component={Radar} />
          </ContentWrap>
          <Paper zDepth={1} style={{ position: 'relative' }}>
            <NavigationBar />
          </Paper>
        </Layout>
      </Router>
    )
  }
}

import React, { Component } from 'react'
import localforage from 'localforage'
import { HashRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'
import { Paper } from 'material-ui'
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
            zoom: 15,
          },
        })
      },
      (err) => {
        // resolve error
        const position = [55.751244, 37.618423]
        MapStore.setItem('map', {
          myLocationPoint: {
            lat: position[0],
            lng: position[1],
          },
          mapState: {
            center: position,
            zoom: 15,
          },
        })
      })
  }

  render() {
    return (
      <Router>
        <Layout>
          <ContentWrap>
            <Route exact path='/' component={Main} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/radar' component={Radar} />
          </ContentWrap>
          <Paper zDepth={1}>
            <NavigationBar />
          </Paper>
        </Layout>
      </Router>
    )
  }
}

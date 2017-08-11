import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'

import { Main, Favorites, Radar } from './pages'

import { NavigationBar } from '../molecules'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const BottomBar = styled.div`
`

const Application = () => (
  <Router>
    <Layout>
      <ContentWrap>
        <Route exact path='/' component={Main} />
        <Route path='/favorites' component={Favorites} />
        <Route path='/radar' component={Radar} />
      </ContentWrap>
      <BottomBar>
        <NavigationBar />
      </BottomBar>
    </Layout>
  </Router>
)

export default Application

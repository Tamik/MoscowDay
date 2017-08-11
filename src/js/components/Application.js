import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import { Main, Favorites, Radar } from './pages'

import { NavigationBar } from '../molecules'

const Application = () => (
  <Router>
    <div>
      <div>
        <Route exact path='/' component={Main} />
        <Route path='/favorites' component={Favorites} />
        <Route path='/radar' component={Radar} />
      </div>
      <div>
        <NavigationBar />
      </div>
    </div>
  </Router>
)

export default Application

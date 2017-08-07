import React, { Component } from 'react'
import { HashRouter as Router, Route, withRouter } from 'react-router-dom'

import FontIcon from 'material-ui/FontIcon'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'

import { Main, Favorites, Radar } from './pages'

const eventsIcon = <FontIcon className='material-icons'>h</FontIcon>
const favoritesIcon = <FontIcon className='material-icons'>f</FontIcon>
const radarIcon = <FontIcon className='material-icons'>r</FontIcon>

class NavigationBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIndex: 0,
    }
  }

  changeRoute = (index, nextRoute) => () => {
    this.setState({
      selectedIndex: index,
    })
    this.props.history.replace(nextRoute)
  }

  render() {
    return (
      <BottomNavigation selectedIndex={this.state.selectedIndex}>
        <BottomNavigationItem label='home' icon={eventsIcon} onTouchTap={this.changeRoute(0, '/')} />
        <BottomNavigationItem label='favorites' icon={favoritesIcon} onTouchTap={this.changeRoute(1, '/favorites')} />
        <BottomNavigationItem label='near me' icon={radarIcon} onTouchTap={this.changeRoute(2, '/radar')} />
      </BottomNavigation>
    )
  }
}

const WrappedNavigationBar = withRouter(NavigationBar)

class Application extends Component {
  state = {
    selectedIndex: 0,
    redirect: false,
    route: '/',
  }

  select(index, route) {
    this.setState({
      selectedIndex: index,
      redirect: true,
      route: route,
    });
  }

  render() {
    return (
      <Router>
        <div>
          <div>
            <Route exact path='/' component={Main} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/radar' component={Radar} />
          </div>
          <div>
            <WrappedNavigationBar />
          </div>
        </div>
      </Router>
    );
  }
}

export default Application

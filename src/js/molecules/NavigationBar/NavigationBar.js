import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import FontIcon from 'material-ui/FontIcon'

const eventsIcon = <FontIcon className='material-icons'>h</FontIcon>
const favoritesIcon = <FontIcon className='material-icons'>f</FontIcon>
const radarIcon = <FontIcon className='material-icons'>r</FontIcon>

class NavigationBarContainer extends Component {
  /**
   * @todo {state} in native storage
   */
  state = {
    selectedIndex: 0,
    currentRoute: null,
  }

  changeRoute = (index, nextRoute) => () => {
    this.setState({
      selectedIndex: index,
      currentRoute: nextRoute,
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

const NavigationBar = withRouter(NavigationBarContainer)

export default NavigationBar

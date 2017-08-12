import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'

import IconHome from 'material-ui/svg-icons/action/home'
import IconFullStar from 'material-ui/svg-icons/toggle/star'
import IconNavigation from 'material-ui/svg-icons/maps/navigation'

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
        <BottomNavigationItem label='home' icon={<IconHome />} onTouchTap={this.changeRoute(0, '/')} />
        <BottomNavigationItem label='favorites' icon={<IconFullStar />} onTouchTap={this.changeRoute(1, '/favorites')} />
        <BottomNavigationItem label='near me' icon={<IconNavigation />} onTouchTap={this.changeRoute(2, '/radar')} />
      </BottomNavigation>
    )
  }
}

const NavigationBar = withRouter(NavigationBarContainer)

export default NavigationBar

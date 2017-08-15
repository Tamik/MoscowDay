import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'

import Icon from 'atoms/Icon'
import UiIconsPack from 'atoms/iconsPacks/UiIconsPack'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const myTheme = {
  bottomNavigation: {
    selectedColor: '#607D8B',
    unselectedColor: '#b7c2cc',
    unselectedFontSize: '10pt',
    selectedFontSize: '10pt',
  },
  menuItem: {
    padding: 0,
  },
}

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
      <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label='События'
            icon={<Icon path={UiIconsPack.MODULE_EVENTS} size='25px' viewBox='0 0 37 35' />}
            onTouchTap={this.changeRoute(0, '/')}
          />
          <BottomNavigationItem
            label='Избранное'
            icon={<Icon path={UiIconsPack.MODULE_FAVS} size='25px' viewBox='0 0 480 470' />}
            onTouchTap={this.changeRoute(1, '/favorites')}
          />
          <BottomNavigationItem
            label='Рядом'
            icon={<Icon path={UiIconsPack.MODULE_RADAR} size='25px' viewBox='0 0 520 510' />}
            onTouchTap={this.changeRoute(2, '/radar')}
          />
        </BottomNavigation>
      </MuiThemeProvider>
    )
  }
}

const NavigationBar = withRouter(NavigationBarContainer)

export default NavigationBar

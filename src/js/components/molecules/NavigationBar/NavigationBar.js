import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { BottomNavigation, BottomNavigationItem } from 'material-ui'

import { Icon, UIPack as IconsUIPack } from 'components/atoms'

const myTheme = {
  bottomNavigation: {
    selectedColor: '#607D8B',
    unselectedColor: '#B7C2CC',
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
        <BottomNavigation
          selectedIndex={this.state.selectedIndex}
          className='bottom-navigation'
        >
          <BottomNavigationItem
            label='События'
            icon={<Icon path={IconsUIPack.MODULE_EVENTS} size='25px' color='' viewBox='0 0 37 35' />}
            onTouchTap={this.changeRoute(0, '/')}
          />
          <BottomNavigationItem
            label='Избранное'
            icon={<Icon path={IconsUIPack.MODULE_FAVS} size='25px' color='' viewBox='0 0 480 470' />}
            onTouchTap={this.changeRoute(1, '/favorites')}
          />
          <BottomNavigationItem
            label='Рядом'
            icon={<Icon path={IconsUIPack.MODULE_RADAR} size='25px' color='' viewBox='0 0 520 510' />}
            onTouchTap={this.changeRoute(2, '/radar')}
          />
        </BottomNavigation>
      </MuiThemeProvider>
    )
  }
}

const NavigationBar = withRouter(NavigationBarContainer)

export default NavigationBar

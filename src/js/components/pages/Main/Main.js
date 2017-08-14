import React, { Component } from 'react'

import SwipableViews from 'react-swipeable-views'
import styled from 'styled-components'

import { TopBar } from 'molecules'
import { Tabs, Tab } from 'material-ui/Tabs'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import { Timeline, Headings, Places } from './Tabs'

const myTheme = {
  tabs: {
    textColor: '#cfd8dc',
    selectedTextColor: '#607d8b',
  },
}

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 5,
  },
  tabs: {
    borderBottom: '1px solid #dbe2e5',
  },
  tabsWrap: {
    height: 40,
    width: '80%',
    margin: '0 auto',
    backgroundColor: 'white',
  },
  tab: {
    fontSize: '16px!important',
  },
}

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow:1;
`

const TopBarWrap = styled.div``

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export default class Main extends Component {
  state = {
    slideIndex: 0,
  }

  handleChange = (index) => {
    this.setState({
      slideIndex: index,
    })
  }

  render() {
    return (
      <PageContent>
        <TopBarWrap>
          <TopBar
            title='События'
            showButton={false}
            isVisible
          />
        </TopBarWrap>
        <ContentWrap>
          <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
            <Tabs
              className={'eventsTabs'}
              style={styles.tabs}
              inkBarStyle={{
                backgroundColor: '#607d8b',
              }}
              tabItemContainerStyle={styles.tabsWrap}
              onChange={this.handleChange}
              value={this.state.slideIndex}
            >
              <Tab label='Главное' value={0} style={styles.tab} disableTouchRipple />
              <Tab label='Рубрики' value={1} style={styles.tab} disableTouchRipple />
              <Tab label='Места' value={2} style={styles.tab} disableTouchRipple />
            </Tabs>
          </MuiThemeProvider>

          <SwipableViews
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <div style={styles.slide}>
              <Timeline />
            </div>
            <div style={styles.slide}>
              <Headings />
            </div>
            <div style={styles.slide}>
              <Places />
            </div>
          </SwipableViews>
        </ContentWrap>
      </PageContent>
    )
  }
}

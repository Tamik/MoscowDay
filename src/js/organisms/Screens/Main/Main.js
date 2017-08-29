import React, { Component } from 'react'
import styled from 'styled-components'
import SwipableViews from 'react-swipeable-views'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import { TopBar } from 'molecules'
import { Tabs, Tab } from 'material-ui/Tabs'

// import { Timeline, Headings, Places } from './Tabs'
import { Timeline, Headings } from './Tabs'

const myTheme = {
  tabs: {
    position: 'relative',
    textColor: '#B7C2CC',
    selectedTextColor: '#455A64',
  },
}

const styles = {
  headline: {
    fontSize: 24,
    fontWeight: 400,
    marginBottom: 12,
    paddingTop: 16,
  },
  slide: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  tabs: {
    position: 'relative',
    borderBottom: '1px solid #dbe2e5',
    zIndex: 300,
  },
  tabsWrap: {
    backgroundColor: 'transparent',
    height: 40,
    width: '80%',
    margin: '0 auto',
  },
  tab: {
    fontSize: '14px',
  },
}

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
      <PageContent style={{ overflowY: 'hidden' }}>
        <TopBarWrap>
          <TopBar
            title='События'
            showButton={false}
            isVisible
          />
        </TopBarWrap>
        <ContentWrap style={{ overflowY: 'hidden' }}>
          <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
            <Tabs
              className='eventsTabs'
              style={styles.tabs}
              inkBarStyle={{
                backgroundColor: '#607D8B',
              }}
              tabItemContainerStyle={styles.tabsWrap}
              onChange={this.handleChange}
              value={this.state.slideIndex}
            >
              <Tab
                label='Главное'
                value={0}
                style={styles.tab}
                disableTouchRipple
              />
              <Tab
                label='Рубрики'
                value={1}
                style={styles.tab}
                disableTouchRipple
              />
              {/* <Tab
                label='Места'
                value={2}
                style={styles.tab}
                disableTouchRipple
              /> */}
            </Tabs>
          </MuiThemeProvider>
          <SwipableViews
            className='swipable-view'
            style={{
              WebkitBoxOrient: 'vertical',
              WebkitBoxDirection: 'normal',
              WebkitFlexDirection: 'column',
              WebkitBoxFlex: 1,
              WebkitFlex: 1,
              flex: 1,
              flexDirection: 'column',
              WebkitOverflowScrolling: 'touch',
              overflowScrolling: 'touch',
              touchAction: 'auto',
            }}
            containerStyle={{
              minHeight: '100%',
            }}
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            disabled
          >
            <div style={styles.slide} className='slide-timeline'>
              <Timeline />
            </div>
            <div style={styles.slide} className='slide-headings'>
              <Headings />
            </div>
            {/* <div style={styles.slide}>
              <Places />
            </div> */}
          </SwipableViews>
        </ContentWrap>
      </PageContent>
    )
  }
}

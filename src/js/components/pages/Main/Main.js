import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import SwipableViews from 'react-swipeable-views'
import styled from 'styled-components'

import FontIcon from 'material-ui/FontIcon'
import { TopBar } from 'molecules'
import { Tabs, Tab } from 'material-ui/Tabs'

import { Timeline, Headings, Places } from './Tabs'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  }
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
            title='Главное'
            isVisible
            showButton={false}
          />
        </TopBarWrap>
        <ContentWrap>
          <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
            <Tab label='Главное' value={0} />
            <Tab label='Рубрики' value={1} />
            <Tab label='Места' value={2} />
          </Tabs>
          <SwipableViews style={{display: 'flex', flexDirection: 'column', flex: 1}} index={this.state.slideIndex} onChangeIndex={this.handleChange}>
            <div>
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

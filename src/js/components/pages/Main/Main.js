import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import SwipableViews from 'react-swipeable-views'

import FontIcon from 'material-ui/FontIcon'
import AppBar from 'material-ui/AppBar'
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
  },
}

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideIndex: 0,
    }
  }

  handleChange = (index) => this.setState({
    slideIndex: index,
  });

  render() {
    return (
      <div>
        <AppBar title='Главное' showMenuIconButton={false} />
        <div>
          <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
            <Tab label='Главное' value={0} />
            <Tab label='Рубрики' value={1} />
            <Tab label='Места' value={2} />
          </Tabs>
          <SwipableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
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
        </div>
      </div>
    )
  }
}

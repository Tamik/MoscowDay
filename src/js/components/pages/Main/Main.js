import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipableViews from 'react-swipeable-views';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import { Link } from 'react-router-dom';
import { Headings } from './Tabs';

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
};

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }

  handleChange = (index) => this.setState({slideIndex: index});

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
              <h2>Headline</h2>
              <p>Text...</p>
            </div>
            <div style={styles.slide}>
              <Headings />
            </div>
            <div style={styles.slide}>
              <p>Text #3</p>
            </div>
          </SwipableViews>
        </div>
      </div>
    );
  }
}

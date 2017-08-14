import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import localforage from 'localforage'

import Paper from 'material-ui/Paper'
import { List, ListItem, Divider } from 'material-ui'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import IconCalendar from 'material-ui/svg-icons/action/date-range'
import IconClock from 'material-ui/svg-icons/device/access-time'
import IconPlace from 'material-ui/svg-icons/maps/place'
import IconArrowBot from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import IconEmptyStar from 'material-ui/svg-icons/toggle/star-border'
import IconFullStar from 'material-ui/svg-icons/toggle/star'
import { grey500, grey700 } from 'material-ui/styles/colors'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

// styled(ListItem)`
//   padding: 5;
//   font-size: 14px;
// `

const styles = {
  item: {
    fontSize: 14,
  }
}
export default class EventInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inFavorites: false,
    }
    console.log(props);
  }

  componentDidMount() {
    this.inFavorites(this.props.event.id)
  }

  addToFavorites = (id, value) => {
    FavoritesStore.setItem(id, value)
      .then(() => {
        this.setState({
          inFavorites: true,
        })
      })
  }

  removeFromFavorites = (id) => {
    FavoritesStore.removeItem(id)
      .then(() => {
        this.setState({
          inFavorites: false,
        })
      })
  }

  inFavorites = (id) => {
    FavoritesStore.getItem(id)
      .then((response) => {
        if (response !== null) {
          this.setState({
            inFavorites: true,
          })
          return
        }
        this.setState({
          inFavorites: false,
        })
      })
  }

  handleFavorites = (id, value) => {
    if (this.state.inFavorites) {
      this.removeFromFavorites(id)
    }
    else {
      this.addToFavorites(id, value)
    }
  }

  render() {
    return (
      <div>
        <Paper zDepth={0}>
          <Card style={{boxShadow: 'none',}} containerStyle={{paddingBottom: 0,}}>
            <CardMedia>
              <img src='//placehold.it/256x256' height='256' alt='' />
            </CardMedia>
            <CardTitle
              title={this.props.event.title}
              style={{
                position: 'relative',
                backgroundColor: '#455a64',
              }}
              titleStyle={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                lineHeight: '1.2em'
              }}
            >
              <FloatingActionButton
                onTouchTap={() => this.handleFavorites(this.props.event.id, this.props.event)}
                backgroundColor='#fff'
                mini
                style={{
                  position: 'absolute',
                  bottom: -20,
                  right: 20,
                  width: 40,
                  height: 40,
                  zIndex: 1000
                }}
                iconStyle={{
                  fill: '#455a64'
                }}
              >
                {this.state.inFavorites
                  ? <IconFullStar />
                  : <IconEmptyStar />
                }
              </FloatingActionButton>
            </CardTitle>
          </Card>

          <List
            style={{
              paddingTop: 0,
            }}
          >
            <Divider />
            <ListItem style={styles.item} primaryText={this.props.event.dateFormatted.day + ' ' + this.props.event.dateFormatted.month} leftIcon={<IconCalendar />} />
            <Divider />
            <ListItem style={styles.item} primaryText={this.props.event.dateFormatted.time} leftIcon={<IconClock />} />
            <Divider />
            <ListItem style={styles.item} primaryText={this.props.event.location_title} leftIcon={<IconPlace />} />
            <Divider />
            <ListItem style={styles.item} primaryText="Описание" leftIcon={<IconArrowBot />} />
            <Divider />
            <ListItem style={styles.item} primaryText = {this.props.event.description}/>
          </List>
        </Paper>
      </div>
    )
  }
}

EventInfo.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    begin_time: PropTypes.string,
    location_title: PropTypes.string,
  }),
}

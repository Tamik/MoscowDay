import React, { Component } from 'react'
import PropTypes from 'prop-types'

import localforage from 'localforage'

import Paper from 'material-ui/Paper'
import { List, ListItem, Divider } from 'material-ui'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import { Modal } from 'components/modals'
import EventOnMap from 'atoms/EventOnMap'

import IconCalendar from 'material-ui/svg-icons/action/date-range'
import IconClock from 'material-ui/svg-icons/device/access-time'
import IconPlace from 'material-ui/svg-icons/maps/place'
import IconArrowBot from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Icon from 'atoms/Icon'
import UiIconsPack from 'atoms/iconsPacks/UiIconsPack'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const myTheme = {
  floatingActionButton: {
    //buttonSize: 56,
    //miniSize: 40,
    secondaryColor: '#d32f2f',
  }
}

const styles = {
  item: {
    fontSize: 14,
  },
}

export default class EventInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: false,
      inFavorites: false,
    }
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

  openEventOnMapModal = () => {
    this.setState({
      isModalVisible: true,
    })
  }

  closeEventOnMapModal = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div>
        <Paper zDepth={0}>

          <Card
            style={{
              boxShadow: 'none',
              WebkitBoxShadow: 'none',
            }}
            containerStyle={{
              paddingBottom: 0,
            }}
          >

            <CardMedia
              style={{
                height: '35vh',
                backgroundSize: 'cover',
                backgroundImage: `url(http://io.yamblz.ru/i/events/${this.props.event.id}_large.jpg)`,
              }}
            />
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
                lineHeight: '1.2em',
              }}
            >
              <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
                <FloatingActionButton
                  onTouchTap={() => this.handleFavorites(this.props.event.id, this.props.event)}
                  secondary={this.state.inFavorites}
                  backgroundColor='#fff'
                  style={{
                    position: 'absolute',
                    bottom: -28,
                    right: 20,
                    zIndex: 1000,
                  }}
                  iconStyle={{
                    fill: '#455A64',
                  }}
                >
                  {this.state.inFavorites
                    ? <Icon path={UiIconsPack.ADD_TO_FAV} size='25px' color='#fff' viewBox='0 0 480 470' />
                    : <Icon path={UiIconsPack.MODULE_FAVS} size='25px' viewBox='0 0 480 470' />
                  }
                </FloatingActionButton>
              </MuiThemeProvider>
            </CardTitle>
          </Card>

          <List
            style={{
              paddingTop: 0,
            }}
          >
            <Divider />
            <ListItem
              primaryText={`${this.props.event.dateFormatted.day} ${this.props.event.dateFormatted.month}`}
              style={styles.item}
              leftIcon={<IconCalendar />}
            />
            <Divider />
            <ListItem
              primaryText={this.props.event.dateFormatted.time}
              style={styles.item}
              leftIcon={<IconClock />}
            />
            <Divider />
            <ListItem
              primaryText={this.props.event.location_title}
              style={styles.item}
              leftIcon={<IconPlace />}
              onClick={this.openEventOnMapModal}
            />
            <Divider />
            <ListItem
              primaryText="Описание"
              style={styles.item}
              leftIcon={<IconArrowBot />}
            />
            <Divider />
            <ListItem
              primaryText={this.props.event.description}
              style={styles.item}
            />
          </List>
        </Paper>
        <Modal
          isOpen={this.state.isModalVisible}
          isVisibleTopBar
          showBackButton
          title={this.props.event.title}
          content={<EventOnMap event={this.props.event} />}
          close={this.closeEventOnMapModal}
        />
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

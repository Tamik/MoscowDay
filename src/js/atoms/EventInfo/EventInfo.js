import React, { Component } from 'react'
import PropTypes from 'prop-types'

import localforage from 'localforage'

import Paper from 'material-ui/Paper'
import { List, ListItem, Divider } from 'material-ui'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import { Modal } from 'components/modals'
import EventOnMap from 'atoms/EventOnMap'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Icon from 'atoms/Icon'
import UiIconsPack from 'atoms/iconsPacks/UiIconsPack'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const AppStore = localforage.createInstance({
  name: 'App',
})

const myTheme = {
  floatingActionButton: {
    // buttonSize: 56,
    // miniSize: 40,
    secondaryColor: '#d32f2f',
  },
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
        AppStore.getItem('client_id')
          .then((clientId) => {
            const object = {}
            object[id] = {
              client_id: clientId,
            }
            window.appMetrica.reportEvent('Добавлено в избранное', object)
            const objectByPeople = {}
            objectByPeople[clientId] = {
              event_id: id,
            }
            window.appMetrica.reportEvent('Добавлено в избранное (по людям)', objectByPeople)
          })
      })
      .then(() => {
        this.setState({
          inFavorites: true,
        })
      })
  }

  removeFromFavorites = (id) => {
    FavoritesStore.removeItem(id)
      .then(() => {
        AppStore.getItem('client_id')
          .then((clientId) => {
            const object = {}
            object[id] = {
              client_id: clientId,
            }
            window.appMetrica.reportEvent('Удалено из избранного', object)
            const objectByPeople = {}
            objectByPeople[clientId] = {
              event_id: id,
            }
            window.appMetrica.reportEvent('Удалено из избранного (по людям)', objectByPeople)
          })
      })
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
                backgroundImage: `url(${process.env.API_HOST}/i/events/${this.props.event.id}_large.jpg)`,
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
                paddingBottom: '25px',
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
                    ? <Icon
                      path={UiIconsPack.ADD_TO_FAV}
                      size='24px'
                      style={{
                        height: 24,
                        margin: '16px',
                      }}
                      color='#fff'
                      viewBox='0 0 500 480'
                    />
                    : <Icon
                      path={UiIconsPack.MODULE_FAVS}
                      size='24px'
                      style={{
                        height: 24,
                        margin: '16px',
                      }}
                      viewBox='0 0 500 480'
                    />
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
              disabled
              leftIcon={
                <Icon
                  path={UiIconsPack.MODULE_EVENTS}
                  color='#455A64'
                  style={{
                    left: 8,
                    width: 18,
                    height: 18,
                    margin: 15,
                  }}
                  viewBox='0 0 33 32'
                />
              }
            />
            <Divider />
            <ListItem
              primaryText={this.props.event.dateFormatted.time}
              style={styles.item}
              disabled
              leftIcon={
                <Icon
                  path={UiIconsPack.CLOCK}
                  color='#455A64'
                  style={{
                    left: 8,
                    width: 18,
                    height: 18,
                    margin: 15,
                  }}
                  viewBox='0 0 610 620'
                />
              }
            />
            <Divider />
            <ListItem
              primaryText={this.props.event.location_title}
              secondaryText={this.props.event.address}
              style={styles.item}
              onClick={this.openEventOnMapModal}
              leftIcon={
                <Icon
                  path={UiIconsPack.MODULE_RADAR}
                  color='#455A64'
                  style={{
                    left: 8,
                    width: 18,
                    height: 18,
                    margin: 15,
                  }}
                  viewBox='0 0 520 510'
                />
              }
            />
            <Divider />
            <ListItem
              primaryText="Описание"
              style={styles.item}
              disabled
              leftIcon={
                <Icon
                  path={UiIconsPack.ARROW_DOWN}
                  color='#455A64'
                  style={{
                    left: 8,
                    width: 18,
                    height: 18,
                    margin: 15,
                  }}
                  viewBox='-8 0 80 60'
                />
              }
            />
            <Divider />
            <div
              style={{ padding: '8px 10px', fontSize: '14px', overflow: 'hidden', userSelect: 'text' }}
              dangerouslySetInnerHTML={{ __html: this.props.event.description }}
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
      </div >
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

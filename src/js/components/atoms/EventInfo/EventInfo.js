import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import localforage from 'localforage'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Card, CardMedia, CardTitle, Divider, List, ListItem, FloatingActionButton, Paper } from 'material-ui'
// import Paper from 'material-ui/Paper'
// import { List, ListItem, Divider } from 'material-ui'
// import { Card, CardMedia, CardTitle } from 'material-ui/Card'
// import FloatingActionButton from 'material-ui/FloatingActionButton'

// import { Modal } from 'components/modals'
// import EventOnMap from 'atoms/EventOnMap'

// import Icon from 'atoms/Icon'
// import UiIconsPack from 'atoms/iconsPacks/UiIconsPack'

// import MDApi from 'utils/MDApi'

import { EventOnMap, Icon, UIPack } from 'atoms'
import { Modal } from 'molecules'
import { MDApi } from 'utils'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const AppStore = localforage.createInstance({
  name: 'App',
})

const myTheme = {
  floatingActionButton: {
    secondaryColor: '#d32f2f',
  },
}

const styles = {
  item: {
    fontSize: 14,
    userSelect: 'text',
  },
}

const AgeLabel = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 1px;
  right: 16px;
  top: 40px;
  font-size: 14px;
  font-weight: bold;
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  color: rgba(69, 90, 100, 1);
  white-space: nowrap;
  z-index: 1101;
`

const BtnShare = styled.div`
  font-size: 14px;
  background-color: #fff8ef;
  border: 1px solid #f7e2c3;
  margin: 8px;
  padding: 16px 0;
  text-align: center;
`
const BtnShowOnMapWrap = styled.div`
  background: rgba(231, 235, 236, 1);
  padding: 16px;
`
const BtnShowOnMap = styled.div`
  font-size: 14px;
  background-color: rgba(255, 255, 255, 1);
  padding-bottom: 0;
`
const BtnShowOnMapContentWrap = styled.div`
  position: relative;
  padding: 16px;
  padding-right: 40px;
`
const BtnShowOnMapTitle = styled.div`
  font-size: 0.8em;
  font-weight: bold;
  background-color: rgba(69, 90, 100, 1);
  height: 46px;
  text-transform: uppercase;
  text-align: center;
  line-height: 46px;
  color: rgba(255, 255, 255, 1);
`

export default class EventInfo extends Component {
  constructor(props) {
    super(props)

    this.beautyDatesRange = MDApi.beautifyEventDatesRange(
      this.props.event.dateFormatted,
      this.props.event.dateEndFormatted
    )

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

  share = () => {
    const event = this.props.event
    const enter = this.props.event.is_free ? 'Свободный вход' : 'Вход платный'

    const messageText = `${event.title}, 
    ${this.beautyDatesRange.dates} ${this.beautyDatesRange.time}, ${enter}, ${event.location_title} (${event.address})`

    const options = {
      message: messageText,
      subject: this.props.event.title,
      files: [`${process.env.API_HOST}/i/events/${event.id}_large.jpg`],
      url: `${process.env.API_HOST}/event/${event.id}`,
      chooserTitle: 'Поделиться событием',
    }

    const onSuccess = (result) => { }
    const onError = (msg) => { }

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError)
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
                position: 'relative',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${process.env.API_HOST}/i/events/${this.props.event.id}_large.jpg)`,
                height: '35vh',
              }}
            >
              <AgeLabel
                style={{
                  width: 32,
                  minWidth: 32,
                }}
              >
                {this.props.event.restriction ? this.props.event.restriction : ''}
              </AgeLabel>
            </CardMedia>
            <CardTitle
              title={this.props.event.title}
              style={{
                position: 'relative',
                backgroundColor: '#455a64',
              }}
              titleStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                paddingBottom: 25,
                lineHeight: '1.2em',
                color: '#fff',
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
                        margin: 16,
                      }}
                      color='#fff'
                      viewBox='0 0 500 480'
                    />
                    : <Icon
                      path={UiIconsPack.MODULE_FAVS}
                      size='24px'
                      style={{
                        height: 24,
                        margin: 16,
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
              primaryText={this.beautyDatesRange.dates}
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
              primaryText={this.beautyDatesRange.time}
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
              primaryText={this.props.event.is_free ? 'Свободный вход' : <span style={{ color: '#ba3e35' }}>Вход платный</span>}
              style={styles.item}
              disabled
              leftIcon={
                <Icon
                  path={UiIconsPack.ENTER}
                  color='#455A64'
                  style={{
                    left: 6,
                    width: 22,
                    height: 22,
                    margin: 15,
                  }}
                  viewBox='0 0 610 620'
                />
              }
            />
            <Divider />
            <BtnShare onClick={this.share}>Поделиться</BtnShare>
            <Divider />
            <BtnShowOnMapWrap>
              <BtnShowOnMap
                onClick={this.openEventOnMapModal}
              >
                <BtnShowOnMapContentWrap>
                  <Icon
                    path={UiIconsPack.MODULE_RADAR}
                    color='#455A64'
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: 16,
                      width: 18,
                      height: 18,
                    }}
                    viewBox='0 0 520 510'
                  />
                  <p>{this.props.event.location_title}</p>
                  <p
                    style={{
                      display: this.props.event.address !== this.props.event.location_title ? 'block' : 'none',
                      marginTop: 6,
                      color: '#888',
                    }}
                  >
                    {this.props.event.address}
                  </p>
                </BtnShowOnMapContentWrap>
                <BtnShowOnMapTitle>Показать на карте</BtnShowOnMapTitle>
              </BtnShowOnMap>
            </BtnShowOnMapWrap>
            <Divider />
            <ListItem
              primaryText='Описание'
              style={{
                ...styles.item,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              disabled
            />
            <Divider />
            <div
              style={{
                fontSize: 14,
                padding: '8px 10px',
                overflow: 'hidden',
                userSelect: 'text',
              }}
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

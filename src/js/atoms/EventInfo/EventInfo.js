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
import IconEmptyStar from 'material-ui/svg-icons/toggle/star-border'
import IconFullStar from 'material-ui/svg-icons/toggle/star'

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const styles = {
  item: {
    fontSize: 14,
  },
}

//TODO
// const Button = styled.button`
//   position: absolute;
//   bottom: 25%;
//   right: 30px;
//   padding: 5px;
//   background-color: white;
//   border-radius: 50%;
//   border: 2px solid #616161;
// `

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
              webkitBoxShadow: 'none',
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
                  zIndex: 1000,
                }}
                iconStyle={{
                  fill: '#455a64',
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

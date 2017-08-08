import React, { Component } from 'react'
import ReactModal from 'react-modal'

import { GridList, GridTile } from 'material-ui/GridList'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import PlacesList from '../../../../modals/PlacesList'

import MDApi from 'utils/MDApi'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500, // 500
    height: 300, // 450
    overflowY: 'auto',
  },
}


export default class Places extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPlacesViewModalVisible: false,
      placesViewModalTitle: null,
      places: [],
    }

    this.openPlacesViewModal = this.openPlacesViewModal.bind(this)
    this.closePlacesViewModal = this.closePlacesViewModal.bind(this)
  }

  componentDidMount() {
    MDApi.getPlaces()
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          places: response.data,
        })
      })
  }

  openPlacesViewModal(title, pId) {
    this.setState({
      isPlacesViewModalVisible: true,
      placeId: pId,
      placesViewModalTitle: title,
    })
  }

  closePlacesViewModal() {
    this.setState({
      isPlacesViewModalVisible: false,
    })
  }

  afterOpenModal() {}

  render() {
    return (
      <div style={styles.root}>
        <GridList cellHeight={180} style={styles.gridList}>
          {this.state.places.map(place => (
            <GridTile
              key={place.id}
              title={place.title}
              subtitle={place.events_count}
              onClick={() => this.openPlacesViewModal(place.title, place.id)}
            />
          ))}
        </GridList>
        <div>
          <ReactModal
            isOpen={this.state.isPlacesViewModalVisible}
            contentLabel='Minimal Modal Example'
            onAfterOpen={this.afterOpenModal}
            shouldCloseOnOverlayClick={false}
            style={{
              overlay: {
                zIndex: 1200,
              },
              content: {
                border: 'none',
                borderRadius: 0,
                padding: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            }}
          >
            <AppBar
              title={this.state.placesViewModalTitle}
              iconElementLeft={
                <IconButton>
                  <NavigationClose onClick={this.closePlacesViewModal} />
                </IconButton>
              }
            />
            <PlacesList category={this.state.placeId} />
          </ReactModal>
        </div>
      </div>
    )
  }
}

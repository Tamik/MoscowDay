import React, { Component } from 'react'

import Modal from 'components/modals/Modal'
import PlacesList from 'components/modals/EventsList'

import { GridList, GridTile } from 'material-ui/GridList'

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
      isModalVisible: false,
      modalTitle: null,
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
      id: pId,
      type: 'place',
      isModalVisible: true,
      modalTitle: title,
    })
  }

  closePlacesViewModal() {
    this.setState({
      isModalVisible: false,
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

        <Modal
          isOpen = {this.state.isModalVisible}
          title = {this.state.modalTitle || ''}
          content = {<PlacesList event = {this.state} />}
          close = {this.closePlacesViewModal}
        />
      </div>
    )
  }
}


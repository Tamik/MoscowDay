import React, { Component } from 'react'

import { Modal } from 'components/modals'
import { EventsList } from 'components/modals'
import { Paper } from 'material-ui'
import styled from 'styled-components'

import MDApi from 'utils/MDApi'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    height: 120,
    width: '49%',
    marginBottom: 5,
    paddingBottom: 7,
    overflowY: 'hidden',
    boxSizing: 'border-box',
  },

}


const GridList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: -5px;
  overflow-y: auto;
`
const Text = styled.div`
  padding: 0 5px;
  font-size: 12px;
`
const Image = styled.img`
  display: block;
  width: 100%;
  height: 80px;
  margin-bottom: 5px;
  object-fit: cover;
`

export default class Places extends Component {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     isModalVisible: false,
  //     modalTitle: null,
  //     places: [],
  //   }

  //   this.openPlacesViewModal = this.openPlacesViewModal.bind(this)
  //   this.closePlacesViewModal = this.closePlacesViewModal.bind(this)
  // }
  state = {
    isModalVisible: false,
    modalTitle: null,
    places: [],
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

  openPlacesViewModal = (title, pId) => {
    this.setState({
      id: pId,
      type: 'place',
      isModalVisible: true,
      modalTitle: title,
    })
  }

  closePlacesViewModal = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div style={styles.root}>
        <GridList>
          {this.state.places.map(place => (
            <Paper zDepth={1} style={styles.paper} key={place.id} onClick={() => this.openPlacesViewModal(place.title, place.id)}>
              <Image src='//placehold.it/80x100' />
              <Text>{place.title} ({place.events_count})</Text>
            </Paper>
          ))}
        </GridList>

        <Modal
          isOpen={this.state.isModalVisible}
          title={this.state.modalTitle}
          isVisibleTopBar={true}
          content={<EventsList event={this.state} />}
          close={this.closePlacesViewModal}
        />
      </div>
    )
  }
}


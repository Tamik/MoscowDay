import React, { Component } from 'react'
import styled from 'styled-components'

import { Paper } from 'material-ui'

import { EventsList, Modal } from 'components/molecules'
import { MDApi } from 'utils'

const styles = {
  root: {
    display: 'flex',
    display: '-webkit-box',
    display: '-webkit-flex',
    flexWrap: 'wrap',
    WebkitFlexWrap: 'wrap',
    justifyContent: 'space-around',
    WebkitBoxPack: 'center',
    WebkitJustifyContent: 'space-between',
  },
  paper: {
    display: 'flex',
    display: '-webkit-box',
    display: '-webkit-flex',
    flexDirection: 'column',
    WebkitBoxOrient: 'vertical',
    WebkitBoxDirection: 'normal',
    WebkitFlexDirection: 'column',
    height: 120,
    width: '49%',
    marginBottom: 5,
    paddingBottom: 7,
    overflowY: 'hidden',
    boxSizing: 'border-box',
    WebkitBoxSizing: 'border-box',
  },

}

const GridList = styled.div`
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content: space-between;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  margin-bottom: -5px;
  overflow-y: auto;
`
const Text = styled.div`
  padding: 0 5px;
  font-size: 12pt;
  color: rgb(69,90,100);
`
const Image = styled.img`
  display: block;
  width: 100%;
  height: 80px;
  margin-bottom: 5px;
  object-fit: cover;
`

export default class Places extends Component {
  state = {
    isModalVisible: false,
    modalTitle: null,
    places: [],
  }

  componentDidMount() {
    MDApi.getPlaces()
      .then(response => (response.json()))
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
            <Paper
              key={place.id}
              onClick={() => this.openPlacesViewModal(place.title, place.id)}
              style={styles.paper}
              zDepth={1}
            >
              <Image src='//placehold.it/80x100' />
              <Text>{place.title} ({place.events_count})</Text>
            </Paper>
          ))}
        </GridList>
        <Modal
          isOpen={this.state.isModalVisible}
          title={this.state.modalTitle}
          isVisibleTopBar
          content={<EventsList event={this.state} />}
          close={this.closePlacesViewModal}
        />
      </div>
    )
  }
}


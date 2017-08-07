import React, { Component } from 'react'

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


export default class Headings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
    }
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
  render() {
    return (
      <div style={styles.root}>
        <GridList cellHeight={180} style={styles.gridList}>
          {this.state.places.map(place => (
            <GridTile key={place.id} title={place.title} subtitle={place.events_count} />
          ))}
        </GridList>
      </div>
    )
  }
}

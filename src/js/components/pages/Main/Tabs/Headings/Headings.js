import React, { Component } from 'react'
import ReactModal from 'react-modal'

import { GridList, GridTile } from 'material-ui/GridList'

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

const tilesData = [
  {
    img: 'images/grid-list/00-52-29-429_640.jpg',
    title: 'Breakfast',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/burger-827309_640.jpg',
    title: 'Tasty burger',
    author: 'pashminu',
  },
  {
    img: 'images/grid-list/camera-813814_640.jpg',
    title: 'Camera',
    author: 'Danson67',
  },
  {
    img: 'images/grid-list/morning-819362_640.jpg',
    title: 'Morning',
    author: 'fancycrave1',
  },
  {
    img: 'images/grid-list/hats-829509_640.jpg',
    title: 'Hats',
    author: 'Hans',
  },
  {
    img: 'images/grid-list/honey-823614_640.jpg',
    title: 'Honey',
    author: 'fancycravel',
  },
  {
    img: 'images/grid-list/vegetables-790022_640.jpg',
    title: 'Vegetables',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/water-plant-821293_640.jpg',
    title: 'Water plant',
    author: 'BkrmadtyaKarki',
  },
]

export default class Headings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      modalTitle: null,
      modalAuthor: null,
    }

    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  handleOpenModal(title, author) {
    this.setState({
      showModal: true,
      modalTitle: title,
      modalAuthor: author,
    })
  }

  handleCloseModal() {
    this.setState({
      showModal: false,
      modalTitle: null,
      modalAuthor: null,
    })
  }

  render() {
    return (
      <div style={styles.root}>
        <GridList cellHeight={180} style={styles.gridList}>
          {tilesData.map(tile => (
            <GridTile
              key={tile.img}
              title={tile.title}
              subtitle={<span>by <b>{tile.author}</b></span>}
              onClick={() => this.handleOpenModal(tile.title, tile.author)}
            >
              <img src={tile.img} alt='' />
            </GridTile>
          ))}
        </GridList>
        <div>
          <ReactModal isOpen={this.state.showModal} contentLabel='Minimal Modal Example' style={{ overlay: { zIndex: 100 }, content: {} }}>
            <button onClick={this.handleCloseModal}>Close</button>
            <GridList cellHeight={180} style={styles.gridList}>
              {tilesData.map(tile => (
                <GridTile
                  key={tile.img}
                  title={tile.title}
                  subtitle={<span>by <b>{tile.author}</b></span>}
                  onClick={() => this.handleOpenModal(tile.title, tile.author)}
                >
                  <img src={tile.img} alt='' />
                </GridTile>
              ))}
            </GridList>
          </ReactModal>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import ReactModal from 'react-modal'

import { GridList, GridTile } from 'material-ui/GridList'
import RaisedButton from 'material-ui/RaisedButton'

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
      showModal: false,
      modalTitle: null,
      modalAuthor: null,
      headings: [],
    }

    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  componentDidMount() {
    MDApi.getCategories({})
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          headings: response.data,
        })
      })
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
          {this.state.headings.map(heading => (
            <GridTile key={heading.id} title={heading.title} subtitle={heading.events_count} onClick={() => this.handleOpenModal(heading.title, heading.events_count)} />
          ))}
        </GridList>
        <div>
          <ReactModal isOpen={this.state.showModal} contentLabel='Minimal Modal Example' style={{ overlay: { zIndex: 100 }, content: {} }}>
            <RaisedButton label='Close' primary={true} onClick={this.handleCloseModal} />
            <p>{this.state.modalTitle} – {this.state.modalAuthor}</p>
          </ReactModal>
        </div>
      </div>
    )
  }
}

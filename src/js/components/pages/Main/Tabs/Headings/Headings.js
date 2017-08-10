import React, { Component } from 'react'

import Modal from 'components/modals/Modal'
import EventsList from 'components/modals/EventsList'

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
      isModalVisible: false,
      modalTitle: null,
      headings: [],
    }

    this.openEventsViewModal = this.openEventsViewModal.bind(this)
    this.closeEventsViewModal = this.closeEventsViewModal.bind(this)
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

  openEventsViewModal(title, catId) {
    this.setState({
      id: catId,
      type: 'headings',
      isModalVisible: true,
      modalTitle: title,
    })
  }

  closeEventsViewModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  afterOpenModal() {}

  render() {
    return (
      <div style={styles.root}>
        <GridList cellHeight={180} style={styles.gridList}>
          {this.state.headings.map(heading => (
            <GridTile
              key={heading.id}
              title={heading.title}
              subtitle={heading.events_count}
              onClick={() => this.openEventsViewModal(heading.title, heading.id)}
            />
          ))}
        </GridList>

        <Modal
          isOpen = {this.state.isModalVisible}
          title = {this.state.modalTitle || ''}
          content = {<EventsList place={this.state} />}
          close = {this.closeEventsViewModal}
        />
      </div>
    )
  }
}
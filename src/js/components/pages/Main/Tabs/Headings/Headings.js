import React, { Component } from 'react'
import ReactModal from 'react-modal'

import { GridList, GridTile } from 'material-ui/GridList'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import EventsList from '../../../../modals/EventsList'

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
      isEventsViewModalVisible: false,
      eventsViewModalTitle: null,
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
      isEventsViewModalVisible: true,
      categoryId: catId,
      eventsViewModalTitle: title,
    })
  }

  closeEventsViewModal() {
    this.setState({
      isEventsViewModalVisible: false,
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
        <div>
          <ReactModal
            isOpen={this.state.isEventsViewModalVisible}
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
              title={this.state.eventsViewModalTitle}
              iconElementLeft={
                <IconButton>
                  <NavigationClose onClick={this.closeEventsViewModal} />
                </IconButton>
              }
            />
            <EventsList category={this.state.categoryId} />
          </ReactModal>
        </div>
      </div>
    )
  }
}

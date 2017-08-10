import React, { Component } from 'react'
import Modal from "../../components/modals/Modal";

export default class ListCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: false
    }

    this.openEventsViewModal = this.openEventsViewModal.bind(this)
    this.closeEventsViewModal = this.closeEventsViewModal.bind(this)
  }

  openEventsViewModal() {
    this.setState({
      isModalVisible: true
    })
  }

  closeEventsViewModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div onClick = {this.openEventsViewModal}>
        <h3>{this.props.title}</h3>
        <p>{this.props.begin_time}</p>

        <Modal
          isOpen = {this.state.isModalVisible}
          title = {this.props.title}
          content = {<p>{this.props.description} Plotva</p>}
          close = {this.closeEventsViewModal}
        />
      </div>
    )
  }
}

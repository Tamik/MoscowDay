import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'

import { ListCard } from 'atoms'
import { DatePicker } from 'molecules'

import MDApi from 'utils/MDApi'

export default class EventsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.event.id,
      type: props.event.type,
      isModalVisible: false,
      title: null,
      events: [],
      currentPage: 1,
      endOfEvents: false,
    }

    this.openEventViewModal = this.openEventViewModal.bind(this)
    this.closeEventViewModal = this.closeEventViewModal.bind(this)
  }

  componentDidMount() {
    this.getEvents()
  }

  getEvents = () => {
    switch (this.state.type) {
      case 'place': MDApi.getEvents({
        place: this.state.id,
        page: this.state.currentPage,
      }).then((response) => {
        return response.json()
      }).then((response) => {
        const isEnd = (response.data.length === 0) ? true : false
        this.setState({
          events: this.state.events.concat(response.data),
          endOfEvents: isEnd,
        })
      })
        break
      case 'headings': MDApi.getEvents({
        category: this.state.id,
        page: this.state.currentPage,
      }).then((response) => {
        return response.json()
      }).then((response) => {
        const isEnd = (response.data.length === 0) ? true : false
        this.setState({
          events: this.state.events.concat(response.data),
          endOfEvents: isEnd,
        })
      })
        break
      default: break
    }
  }

  showMoreEvents = () => {
    this.setState({
      currentPage: ++this.state.currentPage,
    })
    this.getEvents()
  }

  openEventViewModal(payload) {
    this.setState({
      isModalVisible: true,
      data: payload,
    })
  }

  closeEventViewModal() {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div>
        <DatePicker id={this.state.id} />
        {this.state.events.map(item => (
          <ListCard key={item.id} event={item}/>
        ))}
        {this.state.endOfEvents ? ''
          : <FlatButton label='Показать еще' onTouchTap={() => this.showMoreEvents()} />
        }
      </div>
    )
  }
}

EventsList.propTypes = {
  place: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
  })
}

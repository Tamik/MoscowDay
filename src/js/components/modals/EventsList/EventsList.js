import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'

import { ListCard } from 'atoms'
import { DatePicker } from 'molecules'

import MDApi from 'utils/MDApi'

export default class EventsList extends Component {
  constructor(props) {
    super(props)
    const today = new Date()
    this.state = {
      id: props.event.id,
      type: props.event.type,
      isModalVisible: false,
      title: null,
      events: [],
      currentPage: 1,
      endOfEvents: false,
      selectDate: today.getUTCDate(),
      selectMonth: today.getMonth() + 1,
      selectYear: today.getFullYear(),
    }
  }

  componentDidMount() {
    this.getEvents()
  }

  getEvents = () => {
    switch (this.state.type) {
      case 'place': MDApi.getEvents({
        place: this.state.id,
        date: `${this.state.selectYear}-${this.state.selectMonth}-${this.state.selectDate}`,
        page: this.state.currentPage,
      }).then((response) => {
        return response.json()
      }).then((response) => {
        let isEnd
        if (response.data.length === 0) {
          isEnd = true
        }
        else {
          isEnd = false
        }
        this.setState({
          events: this.state.events.concat(response.data),
          endOfEvents: isEnd,
        })
      })
        break
      case 'headings': MDApi.getEvents({
        category: this.state.id,
        date: `${this.state.selectYear}-${this.state.selectMonth}-${this.state.selectDate}`,
        page: this.state.currentPage,
      }).then((response) => {
        return response.json()
      }).then((response) => {
        let isEnd
        if (response.data.length === 0) {
          isEnd = true
        }
        else {
          isEnd = false
        }
        this.setState({
          events: this.state.events.concat(response.data),
          endOfEvents: isEnd,
        })
      })
        break
      default: break
    }
  }

  filterEvents = (day) => {
    this.setState({
      selectDate: day,
    })
  }

  showMoreEvents = () => {
    this.setState({
      currentPage: ++this.state.currentPage,
    })
    this.getEvents()
  }

  openEventViewModal = (payload) => {
    this.setState({
      isModalVisible: true,
      data: payload,
    })
  }

  closeEventViewModal = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div>
        <DatePicker id={this.state.id} currentDate={this.state.selectDate} parent={this} />
        {this.state.events.map((event) => {
          if (event.dateFormatted.day === this.state.selectDate) {
            return (
              <ListCard key={event.id} event={event} />
            )
          }
        })}
        {this.state.endOfEvents
          ? ''
          : <FlatButton
            label='Показать еще'
            style={{
              display: 'block',
              width: '100%',
              margin: '8px auto',
            }}
            onTouchTap={() => this.showMoreEvents()}
          />}
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

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import LinearProgress from 'material-ui/LinearProgress'

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
      loading: true,
      nextPageLoading: false,
    }
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
          loading: false,
          nextPageLoading: false,
        })
      })
        break
      case 'headings': MDApi.getEvents({
        category: this.state.id,
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
          loading: false,
          nextPageLoading: false,
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
      nextPageLoading: true,
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
        {this.state.loading
          ? <LinearProgress
            mode='indeterminate'
            style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          : ''
        }
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
            label={this.state.nextPageLoading
              ? 'Загрузка...'
              : 'Показать еще'
            }
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

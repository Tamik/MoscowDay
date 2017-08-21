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
    const today = MDApi.getTodayMSK()
    this.state = {
      id: props.event.id,
      type: props.event.type,
      isModalVisible: false,
      title: null,
      events: [],
      currentPage: 1,
      endOfEvents: false,
      selectDate: today.date,
      selectMonth: today.month,
      selectYear: today.year,
      loading: true,
      nextPageLoading: false,
    }
  }

  componentDidMount() {
    this.getEvents()
  }

  getEvents = (_params) => {

    const params = _params || {}
    const dt = params.date || `${this.state.selectYear}-${this.state.selectMonth}-${this.state.selectDate}`

    switch (this.state.type) {
      case 'place': MDApi.getEvents({
        place: this.state.id,
        date: dt,
        page: params.page ? params.page : this.state.currentPage,
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

        const newEvents = params.mode === 'append'
          ? this.state.events.concat(response.data)
          : response.data

        this.setState({
          events: newEvents,
          endOfEvents: isEnd,
          loading: false,
          nextPageLoading: false,
        })
      })
        break
      case 'headings':
        MDApi.getEvents({
          category: this.state.id,
          date: dt,
          page: params.page ? params.page : this.state.currentPage,
        }).then((response) => {
          return response.json()
        }).then((response) => {
          let isEnd
          if (response.data.length < 10) {
            isEnd = true
          }
          else {
            isEnd = false
          }

          const newEvents = params.mode === 'append'
            ? this.state.events.concat(response.data)
            : response.data

          this.setState({
            events: newEvents,
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
      currentPage: 1,
    })
    this.getEvents({
      page: 1,
      date: `${this.state.selectYear}-${this.state.selectMonth}-${day}`,
    })
  }

  showMoreEvents = () => {
    this.setState({
      currentPage: ++this.state.currentPage,
      nextPageLoading: true,
    })
    this.getEvents({ mode: 'append' })
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '0 5px',
        }}
      >
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
        <div
          style={{
            marginTop: 48,
          }}
        >
          {this.state.events.map((event) => {
            {/* if (event.dateFormatted.day === this.state.selectDate) {
              return (
                <ListCard key={event.id} event={event} />
              )
            } */}
            return (
              <ListCard key={event.id} event={event} />
            )
          })}
        </div>
        {this.state.endOfEvents
          ? ''
          : <FlatButton
            label={this.state.nextPageLoading
              ? 'Загрузка...'
              : 'Показать еще'
            }
            style={{
              display: this.state.events.length < 9 ? 'none' : 'block',
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

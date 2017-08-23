import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import LinearProgress from 'material-ui/LinearProgress'

import { ListCard } from 'atoms'
import { DatePicker } from 'molecules'

import MDApi from 'utils/MDApi'

const BtnMore = styled.div`
  background: #fff;
  border: 1px solid #f2f2f2;
  height: 40px;
  line-height: 40px;
  text-align: center;
  text-transform: uppercase;
  color: rgb(38, 50, 56);
  font-size: 14px;
  font-family: -apple-system, "San Francisco", "Helvetica Neue", Helvetica, “Lucida Grande”, Roboto, “Segoe UI”, Arial, Ubuntu, sans-serif;
  width: 100%;
  margin: 0 0 8px 0;
`

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

      selectedDate: today.full,

      loading: true,
      nextPageLoading: false,
    }
  }

  componentDidMount() {}

  getEvents = (_params) => {

    const params = _params || {}
    const dt = params.date || `${this.state.selectedDate}`

    switch (this.state.type) {
      case 'place':
        MDApi.getEvents({
          place: this.props.id,
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

  filterEvents = (_selectedDate) => {
    this.setState({
      selectedDate: _selectedDate,
      currentPage: 1,
    })

    this.getEvents({
      page: 1,
      date: _selectedDate,
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
        <DatePicker id={this.state.id} currentDate={this.state.selectedDate} parent={this} />
        <div
          style={{
            marginTop: 56,
          }}
        >
          {this.state.events.map((event) => {
            return (<ListCard key={event.id} event={event} />)
          })}
        </div>
        {!this.state.endOfEvents
          ? <BtnMore onClick={() => this.showMoreEvents()}>
            {this.state.nextPageLoading ? 'Загрузка...' : 'Показать еще'}
          </BtnMore>
          : ''}
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

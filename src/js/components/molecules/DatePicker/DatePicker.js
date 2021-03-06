import React, { Component } from 'react'
import moment from 'moment'

import { DropDownMenu, MenuItem } from 'material-ui'
import { MDApi } from 'utils'

export default class DatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datesId: props.id,
      dates: [],
      selectedDate: props.currentDate,
    }
  }

  componentDidMount() {
    MDApi.getDatesInCategory(this.state.datesId)
      .then(response => (response.json()))
      .then((response) => {
        // Покажем события на первый из будущих дней 
        // (в которых есть запланированные события)
        if (response.data.length) {
          this.setState({
            dates: response.data,
            selectedDate: response.data[0].dt,
          })
          this.props.parent.filterEvents(response.data[0].dt)
        }
      })
  }

  formatDate = (date) => {
    const today = MDApi.getTodayMSK()
    const tomorrow = moment(today.full).add(1, 'days').format('YYYY-MM-DD')

    const postfix = MDApi.getDeclineOfNumber(date.count, ['событие', 'события', 'событий'])

    if (date.dt === today.full) {
      return `Сегодня (${date.count} ${postfix})`
    }

    if (date.dt === tomorrow) {
      return `Завтра (${date.count} ${postfix})`
    }

    return {
      date: `${date.dateFormatted.day} ${date.dateFormatted.month}`,
      count: `${date.count} ${postfix}`,
    }
  }

  handleChange = (event, index, _selectedDate) => {
    this.setState({
      selectedDate: _selectedDate,
    })
    this.props.parent.filterEvents(_selectedDate)
  }

  render() {
    return (
      <DropDownMenu
        key={'ref'}
        value={this.state.selectedDate}
        onChange={this.handleChange}
        iconStyle={{ fill: 'rgba(0, 0, 0, .87)' }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          zIndex: 1000,
        }}
      >
        {this.state.dates.map((item) => {
          const formattedDate = this.formatDate(item)
          return (
            <MenuItem
              key={item.dt}
              value={item.dt}
              primaryText={<span><strong>{formattedDate.date}</strong> <span style={{ color: '#888' }}>({formattedDate.count})</span></span>}
            />
          )
        })}
      </DropDownMenu>
    )
  }
}

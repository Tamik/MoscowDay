import React, { Component } from 'react'
import moment from 'moment'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import MDApi from 'utils/MDApi'

export default class DatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datesId: props.id,
      dates: [],
      selectedDate: props.currentDate,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    MDApi.getDatesInCategory(this.state.datesId)
      .then((response) => {
        return response.json()
      })
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

    if (date.dt === today.full) {
      return `Сегодня (${date.count})`
    }

    if (date.dt === tomorrow) {
      return `Завтра (${date.count})`
    }

    return `${date.dateFormatted.day} ${date.dateFormatted.month} (${date.count})`
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
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
        }}
      >
        {this.state.dates.map(item => (
          <MenuItem
            key={item.dt}
            value={item.dt}
            primaryText={this.formatDate(item)}
          />
        ))}
      </DropDownMenu>
    )
  }
}

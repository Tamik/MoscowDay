import React, { Component } from 'react'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import MDApi from 'utils/MDApi'

export default class DatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datesId: props.id,
      dates: [],
      selectedValue: props.currentDate,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    MDApi.getDatesInCategory(this.state.datesId)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        const today = MDApi.getTodayMSK()
        this.setState({
          dates: response.data,
          selectedValue: parseInt(today.date, 10),
        })
      })
  }

  formatDate = (date) => {
    const today = MDApi.getTodayMSK()
    const todayDateInt = parseInt(today.date, 10)

    if (date.day === todayDateInt) {
      return 'Сегодня'
    }
    else if (date.day > todayDateInt && date.day - todayDateInt === 1) {
      return 'Завтра'
    }
    return `${date.day} ${date.month}`
  }

  handleChange = (event, index, value) => {
    this.setState({
      selectedValue: value,
    })
    this.props.parent.filterEvents(value)
  }

  render() {
    return (
      <DropDownMenu
        key={'ref'}
        value={this.state.selectedValue}
        onChange={this.handleChange}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
        }}
      >
        {this.state.dates.map(dt => (
          <MenuItem
            key={dt.dt}
            value={dt.dateFormatted.day}
            primaryText={this.formatDate(dt.dateFormatted)}
          />
        ))}
      </DropDownMenu>
    )
  }
}

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
  }

  componentDidMount() {
    MDApi.getDatesInCategory(this.state.datesId)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        const today = new Date()
        this.setState({
          dates: response.data,
          selectedValue: today.getUTCDate(),
        })
      })
  }

  formatDate = (date) => {
    const today = new Date()
    if (date.day === today.getUTCDate()) {
      return 'Сегодня'
    }
    else if (date.day > today.getUTCDate() && date.day - today.getUTCDate() === 1) {
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
        {this.state.dates.map(event => (
          <MenuItem
            key={event.id}
            value={event.dateFormatted.day}
            primaryText={this.formatDate(event.dateFormatted)}
          />
        ))}
      </DropDownMenu>
    )
  }
}

import React, { Component } from 'react'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import MDApi from 'utils/MDApi'

export default class DatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      label: moment(new Date()).fromNow(),
      datesId: props.id,
      dates: [],
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
      targetOrigin: {
        horizontal: 'left',
        vertical: 'top',
      },
    }
  }

  componentDidMount() {
    MDApi.getDatesInCategory(this.state.datesId)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          dates: response.data,
        })
      })
  }

  setAnchor = (positionElement, position) => {
    const target = this.state.targetOrigin
    target[positionElement] = position
    this.setState({
      targetOrigin: target,
    })
  }

  handleTouchTap = (event) => {
    event.preventDefault()
    this.setState({
      isOpen: true,
      anchorOrigin: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      isOpen: false,
    })
  }

  handleSelectDate = (title) => {
    this.setState({
      isOpen: false,
      label: title,
    })
  }

  render() {
    return (
      <DropDownMenu
        key={'ref'}
        value={this.state.selectedValue}
        onChange={this.handleChange}
        style={{
          display: 'block',
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

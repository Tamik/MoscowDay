import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import Popover from 'material-ui/Popover/Popover'
import { Menu, MenuItem } from 'material-ui/Menu'

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
      <div>
        <RaisedButton label={this.state.label} onTouchTap={this.handleTouchTap} />
        <Popover
          open={this.state.isOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={this.state.anchorOrigin}
          targetOrigin={this.state.targetOrigin}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem
              key='Today'
              primaryText={moment(new Date()).fromNow()}
              onClick={() => this.handleSelectDate(moment(new Date()).fromNow())}
            />
            {this.state.dates.map(event => (
              <MenuItem
                key={event.dt}
                primaryText={moment(event.dt).fromNow()}
                onClick={() => this.handleSelectDate(moment(event.dt).fromNow())}
              />
            )
            )}
          </Menu>
        </Popover>
      </div>
    )
  }
}

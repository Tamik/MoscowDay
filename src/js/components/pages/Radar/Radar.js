import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'

import { Map } from 'components/map'
import MDApi from 'utils/MDApi'

export default class Radar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: [],
    }
  }

  componentDidMount() {
    const date = new Date()
    const month = '0'.concat(date.getMonth() + 1).slice(-2)
    const day = '0'.concat(date.getDate() + 1).slice(-2)

    MDApi.getEvents({
      items_per_page: 500, // all on today
      /**
       * date = today
       * @todo: Решить проблему с разницей в часовых поясах
       */
      data: `${date.getFullYear()}-${month}-${day}`,
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          events: response.data,
        })
      }).catch((err) => {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <AppBar title='События рядом' showMenuIconButton={false} />
        <Map points={this.state.events} panToMyLocation />
      </div>
    )
  }
}

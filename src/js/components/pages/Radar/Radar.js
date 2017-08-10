import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'

import MixMap from '../../map/MixMap'
import MDApi from 'utils/MDApi'

export default class Radar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: []
    }
  }

  componentDidMount() {
    const date = new Date();
    MDApi.getEvents({
      items_per_page: 500, // all on today
      /**
       * date = today
       * @todo: Решить проблему с разницей в часовых поясах
       */
      date: [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-')
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          events: response.data,
        })
      }).catch((err) => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        <AppBar title='События рядом' showMenuIconButton={false} />
        <MixMap points={this.state.events} panToMyLocation={true} />
      </div>
    )
  }

}

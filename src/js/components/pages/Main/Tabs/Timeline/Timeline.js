import React, { Component } from 'react'

import MDApi from 'utils/MDApi'

export default class Timeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
    }
  }

  componentDidMount() {
    MDApi.getEvents({
      is_main: 1,
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          events: response.data,
        })
      })
  }

  render() {
    return (
      <div>
        <h2>Timeline Component</h2>
        {this.state.events.map(event => (
          <h2 key={event.id}>{event.title}</h2>
        ))}
      </div>
    )
  }
}

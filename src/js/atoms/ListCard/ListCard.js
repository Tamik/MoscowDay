import React, { Component } from 'react'

export default class ListCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <p>{this.props.begin_time}</p>
      </div>
    )
  }
}

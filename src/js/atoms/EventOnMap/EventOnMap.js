import React, { Component } from 'react'
import { Map } from 'components/map'

const EventOnMap = (props) => {
  return (
    <Map
      points={[props.event]}
      panToMyLocation={false}
      panToLocation={[props.event.lat, props.event.lng]}
      isOneEvent
      height={'90.1vh'}
      zoom={18}
    />
  )
}

export default EventOnMap
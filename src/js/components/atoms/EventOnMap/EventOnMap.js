import React from 'react'
import { Map } from 'components/molecules'

const EventOnMap = props => (
  <Map
    points={[props.event]}
    panToMyLocation={false}
    panToLocation={[props.event.lat, props.event.lng]}
    isOneEvent
    sharedState={props.event}
    parent={{
      state: {
        events: [props.event],
      },
    }}
    zoom={18}
  />
)

export default EventOnMap

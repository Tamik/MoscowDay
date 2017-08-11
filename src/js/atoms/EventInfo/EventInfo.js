import React from 'react'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'
import { Divider } from 'material-ui'
import { List, ListItem } from 'material-ui';
import { Card, CardMedia, CardTitle } from 'material-ui/Card'

import styled from 'styled-components'

import IconCalendar from 'material-ui/svg-icons/action/date-range'
import IconClock from 'material-ui/svg-icons/device/access-time'
import IconPlace from 'material-ui/svg-icons/maps/place'
import IconArrowBot from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

const style = {
  //height: 200,
  //margin: 10,
}

styled(ListItem)`
  padding: 10
  color: 
`
const EventInfo = (props) => {
  const { title, begin_time, location_title, description } = props.event
  console.log(begin_time);
  return (
    <div>
      <Paper style={style} zDepth={1}>
        <Card>
          <CardMedia>
            <img src='//placehold.it/256x256' alt='' />
          </CardMedia>
          <CardTitle title = { title } />
        </Card>
        <List>
          <ListItem primaryText="ДАТА" leftIcon={<IconCalendar />}/>
          <Divider />

          <ListItem primaryText="ВРЕМЯ" leftIcon={<IconClock />}/>
          <Divider />

          <ListItem primaryText = {location_title} leftIcon={<IconPlace />}/>
          <Divider />

          <ListItem primaryText="Описание" leftIcon={<IconArrowBot />}/>
          <Divider />

          <ListItem
            // primaryText = {description}
            primaryText="День бездомных животных — напоминание всему человечеству о важности оказания помощи тем, кому она необходима. 19 августа фонд «Дарящие надежду» и бренд кормов для домашних животных PURINA проведут фестиваль собак и кошек из приютов, которые очень хотят «Домой!»"
          />
        </List>
      </Paper>
    </div>
  )
}

EventInfo.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    begin_time: PropTypes.string,
    location_title: PropTypes.string,
  }).isRequired,
}

export default EventInfo

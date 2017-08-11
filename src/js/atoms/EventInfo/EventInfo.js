import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import Paper from 'material-ui/Paper'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'

const style = {
  // height: 200,
  //margin: 10,
}

// Разметка детального события

const EventInfo = (props) => {
  const { title, close } = props

  return (
    <div>
      <Paper style={style} zDepth={1}>
        <Card>
          <IconButton>
            <NavigationClose onClick={close} />
          </IconButton>
          <CardMedia>
            <img src='//placehold.it/256x256' alt='' />
          </CardMedia>
          <CardTitle title='Hello, world!' subtitle='Hello, subworld!' />
        </Card>
      </Paper>
    </div>
  )
}

EventInfo.propTypes = {
  title: PropTypes.string,
  close: PropTypes.func.isRequired,
}

export default EventInfo

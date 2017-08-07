import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'

const style = {
  // height: 200,
  margin: 10,
}

const Favorites = () => (
  <div>
    <AppBar title='Избранное' showMenuIconButton={false} />
    <Paper style={style} zDepth={1}>
      <Card>
        <CardMedia>
          <img src='//placehold.it/256x256' alt='' />
        </CardMedia>
        <CardTitle title='Hello, world!' subtitle='Hello, subworld!' />
      </Card>
    </Paper>
  </div>
)

export default Favorites

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import localforage from 'localforage'

import Paper from 'material-ui/Paper'
import { Divider } from 'material-ui'
import { List, ListItem } from 'material-ui';
import { Card, CardMedia, CardTitle } from 'material-ui/Card'

import styled from 'styled-components'

import IconCalendar from 'material-ui/svg-icons/action/date-range'
import IconClock from 'material-ui/svg-icons/device/access-time'
import IconPlace from 'material-ui/svg-icons/maps/place'
import IconArrowBot from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import IconEmptyStar from 'material-ui/svg-icons/toggle/star-border'
import IconFullStar from 'material-ui/svg-icons/toggle/star'
import {grey700} from 'material-ui/styles/colors';

const FavoritesStore = localforage.createInstance({
  name: 'Favorites',
})

const style = {
  //height: 200,
  //margin: 10,
}

styled(ListItem)`
  padding: 10;
`

const Button = styled.button`
  position: absolute;
  bottom: 25%;
  right: 30px;
  padding: 5px;
  background-color: white;
  border-radius: 50%;
  border: 2px solid #616161;
`

export default class EventInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inFavorites: false,
    }
  }

  addToFavorites = (id, value) => {
    FavoritesStore.setItem(id, value)
      .then(() => {
        this.setState({
          inFavorites: true,
        })
      })
  }

  removeFromFavorites = (id) => {
    FavoritesStore.removeItem(id)
      .then(() => {
        this.setState({
          inFavorites: false,
        })
      })
  }

  inFavorites = (id) => {
    FavoritesStore.getItem(id)
      .then((response) => {
        if(response !== null) {
          this.setState({
            inFavorites: true,
          })
          return
        }
        this.setState({
          inFavorites: false,
        })
      })
  }

  handleFavorites = (id, value) => {
    if(this.state.inFavorites) {
      this.removeFromFavorites(id)
    }
    else {
      this.addToFavorites(id, value)
    }
  }

  render() {
    // const { title, begin_time, location_title, description } = props.event
    return (
      <div >
        <Paper zDepth={1}>
          <Card>
            <CardMedia>
              <img src='//placehold.it/256x256' height='256' alt='' />
            </CardMedia>
            <CardTitle title = { this.props.event.title } style={{position: 'relative'}}>
              <Button onClick={() =>
                this.handleFavorites(this.props.event.id, this.props.event)}>{this.state.inFavorites
                ? <IconFullStar color={grey700}/>
                : <IconEmptyStar color={grey700} />}
              </Button>
            </CardTitle>
          </Card>
          <List style={{paddingTop: '0'}}>
            <ListItem primaryText="ДАТА" leftIcon={<IconCalendar />}/>
            <Divider />
            <ListItem primaryText="ВРЕМЯ" leftIcon={<IconClock />}/>
            <Divider />
            <ListItem primaryText = {this.props.event.location_title} leftIcon={<IconPlace />}/>
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
}
// const EventInfo = (props) => {
//   const { title, begin_time, location_title, description } = props.event
//
//   return (
//     <div>
//       <Paper style={style} zDepth={1}>
//         <Card>
//           <CardMedia>
//             <img src='//placehold.it/256x256' alt='' />
//           </CardMedia>
//           <CardTitle title = { title } style={{position: 'relative'}}>
//             <Button onClick={handle}><IconEmptyStar/></Button>
//           </CardTitle>
//         </Card>
//         <List>
//           <ListItem primaryText="ДАТА" leftIcon={<IconCalendar />}/>
//           <Divider />
//
//           <ListItem primaryText="ВРЕМЯ" leftIcon={<IconClock />}/>
//           <Divider />
//
//           <ListItem primaryText = {location_title} leftIcon={<IconPlace />}/>
//           <Divider />
//
//           <ListItem primaryText="Описание" leftIcon={<IconArrowBot />}/>
//           <Divider />
//
//           <ListItem
//             // primaryText = {description}
//             primaryText="День бездомных животных — напоминание всему человечеству о важности оказания помощи тем, кому она необходима. 19 августа фонд «Дарящие надежду» и бренд кормов для домашних животных PURINA проведут фестиваль собак и кошек из приютов, которые очень хотят «Домой!»"
//           />
//         </List>
//       </Paper>
//     </div>
//   )
// }

EventInfo.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    begin_time: PropTypes.string,
    location_title: PropTypes.string,
  }).isRequired,
}

// export default EventInfo

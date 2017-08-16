import React from 'react'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'

import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back'

const TopBar = (props) => {
  const style = !props.isVisible ? {
    block: {
      background: '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4)), to(transparent))',
      background: '-webkit-linear-gradient(top, rgba(0, 0, 0, 0.4), transparent)',
      background: '-o-linear-gradient(top, rgba(0, 0, 0, 0.4), transparent)',
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)',
      paddingTop: '20px',
      position: 'fixed',
      paddingRight: 24,
    },
    btn: 'white',
  } : {
    block: {
      paddingTop: '20px',
      textAlign: 'center',
      backgroundColor: '#fff',

    },
    title: {
      height: 50,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#263238',
      textTransform: 'uppercase',
    },
    btn: 'black',
  }

  return (
    <AppBar
      title={props.title}
      titleStyle={style.title}
      style={style.block}
      zDepth={0}
      showMenuIconButton={props.showButton}
      iconElementLeft={
        <IconButton>
          <NavigationBack onTouchTap={props.close} color={style.btn} />
        </IconButton>
      }
      iconElementRight={props.iconElementRight}
    />
  )
}

TopBar.propTypes = {
  title: PropTypes.string,
  close: PropTypes.func,
  isVisible: PropTypes.bool,
  showButton: PropTypes.bool,
}

export default TopBar

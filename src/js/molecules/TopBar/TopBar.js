import React from 'react'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back'

const TopBar = (props) => {
  const style = !props.isVisible ? {
    block: {
      backgroundColor: "transparent",
      position: "fixed",
    },
    title: {

    }
  } : {
    block: {
      textAlign: "center",
      backgroundColor: "#fff",
    },
    title: {
      height: 50,
      fontSize: 18,
      fontWeight: 'bold',
      color: "#000",
      textTransform: 'uppercase',
    }
  }

  return (
    <AppBar
      title = {props.title}
      titleStyle = {style.title}
      style = {style.block}
      zDepth = {0}
      showMenuIconButton = {props.showButton}
      iconElementLeft = {
        <IconButton>
          <NavigationBack onClick = {props.close} color = {'black'}/>
        </IconButton>
      }
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

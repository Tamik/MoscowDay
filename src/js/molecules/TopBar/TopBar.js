import React from 'react'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back'

const TopBar = (props) => {
  const style = !props.isVisible ? {
    backgroundColor: "transparent",
    position: "fixed",
  } : null

  const isShadow = !props.isVisible ? 0 : 1;

  return (
    <AppBar
      title = {props.title}
      style = {style}
      zDepth = {isShadow}
      iconElementLeft = {
        <IconButton>
          <NavigationBack onClick = {props.close} />
        </IconButton>
      }
    />
  )
}

TopBar.propTypes = {
  title: PropTypes.string,
  close: PropTypes.func,
  isVisible: PropTypes.bool,
}

export default TopBar

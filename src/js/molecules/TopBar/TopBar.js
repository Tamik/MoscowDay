import React from 'react'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const TopBar = (props) => {
  return (
    <AppBar
      title={props.title}
      iconElementLeft={
      <IconButton>
        <NavigationClose onClick={props.close} />
      </IconButton>
    }
    />
  )
}

TopBar.propTypes = {
  title: PropTypes.string,
  close: PropTypes.func,
}

export default TopBar

import React from 'react'
import PropTypes from 'prop-types'

import { AppBar, IconButton } from 'material-ui'
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back'

const TopBar = (props) => {
  const style = !props.isVisible
    ? {
      block: {
        position: 'fixed',
        background: '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4)), to(transparent))',
        background: '-webkit-linear-gradient(top, rgba(0, 0, 0, 0.4), transparent)',
        background: '-o-linear-gradient(top, rgba(0, 0, 0, 0.4), transparent)',
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)',
        paddingTop: '20px',
        paddingRight: 24,
      },
      btn: 'white',
    }
    : {
      block: {
        backgroundColor: '#fff',
        paddingTop: 20,
        textAlign: 'center',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        height: 50,
        color: '#263238',
        textTransform: 'uppercase',
      },
      btn: 'black',
    }

  return (
    <AppBar
      className='topbar'
      title={props.title}
      titleStyle={style.title}
      style={style.block}
      zDepth={0}
      showMenuIconButton={props.showButton}
      iconElementLeft={
        <IconButton>
          <NavigationBack
            color={style.btn}
            onClick={props.close}
          />
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

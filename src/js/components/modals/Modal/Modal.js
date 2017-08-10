import React from 'react'
import ReactModal from 'react-modal'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

function Modal(props) {
  return (
    <div>
      <ReactModal
        isOpen = {props.isOpen}
        contentLabel = {props.title}
        shouldCloseOnOverlayClick={false}
        style={{
          overlay: {
            zIndex: 1200,
          },
          content: {
            border: 'none',
            borderRadius: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}
      >
        <AppBar
          title={props.title}
          iconElementLeft={
            <IconButton>
              <NavigationClose onClick={props.close} />
            </IconButton>
          }
        />
        {props.content}
      </ReactModal>
    </div>
  )
}

export default Modal
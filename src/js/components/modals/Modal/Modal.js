import React from 'react'
import ReactModal from 'react-modal'
import PropTypes from 'prop-types'
import { EventInfo } from 'atoms'

import { TopBar } from 'molecules'


const Modal = props => {
  const TopBarApp = props.topBar ? <TopBar title={props.title} close={props.close} /> : null

  return (
    <div>
      <ReactModal
        isOpen={props.isOpen}
        contentLabel={props.title}
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
        {TopBarApp}

        {props.content}
      </ReactModal>
    </div>
  )
}

Modal.propTypes = {
  title: PropTypes.string,
  //content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func,
  topBar: PropTypes.bool,
}

export default Modal

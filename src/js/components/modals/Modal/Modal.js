import React from 'react'
import ReactModal from 'react-modal'
import PropTypes from 'prop-types'
import { EventInfo } from 'atoms'

import { TopBar } from 'molecules'


const onScroll = (e) => {
  console.log(e)
}

const Modal = props => {
  return (
    <div>
      <ReactModal
        isOpen={props.isOpen}
        contentLabel={props.title || ''}
        shouldCloseOnOverlayClick={false}
        style={{
          overlay: {
            zIndex: 1200,
            overflowY: 'hidden',
          },
          content: {
            border: 'none',
            borderRadius: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
            overflowY: 'hidden',
          },
        }}
      >
        <TopBar
        isVisible = {props.isVisibleTopBar}
        close = {props.close}
        title = {props.title}
      />
      <div style={{ overflowY:'auto', flex: 1,}}>
        {props.content}
      </div>
      </ReactModal>
    </div>
  )
}

Modal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func,
  isVisibleTopBar: PropTypes.bool,

}

export default Modal

import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import { TopBar } from 'molecules'

// const onScroll = (e) => {
//   console.log(e)
// }

const Modal = props => (
  <div>
    <ReactModal
      isOpen={props.isOpen}
      contentLabel={props.title || ''}
      shouldCloseOnOverlayClick={false}
      style={{
        overlay: {
          overflowY: 'hidden',
          zIndex: 1200,
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: 'none',
          borderRadius: 0,
          padding: 0,
          overflowY: 'hidden',
        },
      }}
    >
      <TopBar
        isVisible={props.isVisibleTopBar}
        close={props.close}
        title={props.title}
      />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
        className='modal-content-wrap'
      >
        {props.content}
      </div>
    </ReactModal>
  </div>
)

Modal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func,
  isVisibleTopBar: PropTypes.bool,

}

export default Modal

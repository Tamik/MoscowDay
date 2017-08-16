import React from 'react'
import PropTypes from 'prop-types'

const Icon = (props) => {
  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    path: {
      fill: props.color,
    },
  }

  Object.assign(styles.svg, props.style)

  return (
    <svg
      style={styles.svg}

      viewBox={props.viewBox}
      width={props.size}
      height={props.size}
    >
      <path style={styles.path} d={props.path} />
    </svg>
  )
}

Icon.propTypes = {
  path: PropTypes.string.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  viewBox: PropTypes.string,
}

Icon.defaultProps = {
  size: '16px',
  color: 'rgba(0,0,0,0.7)',
  viewBox: '0 0 512 512',
}

export default Icon

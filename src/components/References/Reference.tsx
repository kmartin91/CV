import React from 'react'
import PropTypes from 'prop-types'

interface ReferenceInterface {
  reference: {
    name: string
    job: string
  }
}

const Reference = ({ reference }: ReferenceInterface) => {
  if (!reference) return null
  return (
    <React.Fragment>
      <div className="headline headline_alt">{reference.name}</div>
      <div className="refJob">{reference.job}</div>
    </React.Fragment>
  )
}

Reference.defaultProps = {
  reference: undefined,
}

Reference.propTypes = {
  reference: PropTypes.shape({
    name: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
  }),
}

export default Reference

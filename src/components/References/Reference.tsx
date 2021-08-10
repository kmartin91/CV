import React from 'react'
import PropTypes from 'prop-types'

interface PropsInterface {
  reference: ReferenceInterface
}

const Reference = ({ reference }: PropsInterface) => {
  if (!reference) return null

  const { name, job }: ReferenceInterface = reference
  return (
    <React.Fragment>
      <div className="headline headline_alt">{name}</div>
      <div className="refJob">{job}</div>
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

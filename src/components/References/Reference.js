import React from 'react'

const Reference = ({ reference }) => {
  if (!reference) return null
  return (
    <>
      <div className="headline headline_alt">{reference.name}</div>
      <div className="refJob">{reference.job}</div>
    </>
  )
}

export default Reference

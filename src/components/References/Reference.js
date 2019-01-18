import React from 'react'

const Reference = ({ reference }) => (
  <>
    <div className="headlineCompetence">{reference.name}</div>
    <div className="refJob">{reference.job}</div>
  </>
)

export default Reference

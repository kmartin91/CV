import React from 'react'

import CompetencesList from './CompetencesList'

const Competences = ({ competences }) => (
  <>
    <span className="title">
      <i className="fa fa-desktop" aria-hidden="true" /> COMPETENCES
    </span>
    {competences.map((subcompetence, index) => {
      return <CompetencesList key={index} competenceslist={subcompetence} />
    })}
  </>
)

export default Competences

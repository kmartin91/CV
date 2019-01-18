import React from 'react'
import Competence from './Competence.js'

const CompetencesList = ({ competenceslist }) => (
  <>
    <div className="headlineCompetence">{competenceslist.label}</div>
    {competenceslist.values.map((competence, index) => {
      return <Competence key={index} competence={competence} />
    })}
  </>
)

export default CompetencesList

import React from 'react'
import Competence from './Competence.js'

const CompetencesList = ({ competenceslist }) => (
  <>
    <div className="headline">{competenceslist.label}</div>
    {competenceslist.values
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
      .map((competence, index) => {
        return <Competence key={index} competence={competence} />
      })}
  </>
)

export default CompetencesList

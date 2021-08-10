import React from 'react'
import PropTypes from 'prop-types'
import Competence from './Competence'

interface CompetenceslistInterface {
  competencesList: {
    label: string
    values: Array<{ value: string; name: string }>
  }
}

const CompetencesList = ({ competencesList }: CompetenceslistInterface) => {
  if (!competencesList) return null
  return (
    <React.Fragment>
      <div className="headline headline_alt">{competencesList.label}</div>
      {competencesList.values
        .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
        .map((competence, index) => {
          return <Competence key={index} competence={competence} />
        })}
    </React.Fragment>
  )
}

CompetencesList.propTypes = {
  competencesList: PropTypes.shape({
    label: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
  }),
}

export default CompetencesList

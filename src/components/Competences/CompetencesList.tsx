import React from 'react'
import PropTypes from 'prop-types'
import Competence from './Competence'

interface PropsInterface {
  competencesList: CompetencesInterface
}

const CompetencesList = ({ competencesList }: PropsInterface) => {
  if (!competencesList) return null
  return (
    <React.Fragment>
      <div className="headline headline_alt">{competencesList.label}</div>
      {competencesList.values
        .sort(
          (a: CompetenceInterface, b: CompetenceInterface) =>
            parseFloat(b.value) - parseFloat(a.value),
        )
        .map((competence: CompetenceInterface, index: number) => {
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

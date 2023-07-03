import PropTypes from 'prop-types'
import React from 'react'
import './Competence.scss'

interface PropsInterface {
  competence: CompetenceInterface
}

const Competence = ({ competence }: PropsInterface) => {
  if (!competence) return null
  const { name }: CompetenceInterface = competence
  return <span className="nameSkill">{name}</span>
}

Competence.propTypes = {
  competence: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

export default Competence

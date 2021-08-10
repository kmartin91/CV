import React from 'react'
import PropTypes from 'prop-types'
import Level from '../Level/Level'
import './Competence.scss'

interface CompetenceInterface {
  competence: {
    name: string
    value: string
  }
}

const Competence = ({ competence }: CompetenceInterface) => {
  if (!competence) return null
  return (
    <article className="Competence">
      <span className="nameSkill">{competence.name}</span>
      <Level level={competence.value} />
    </article>
  )
}

Competence.propTypes = {
  competence: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
}

export default Competence

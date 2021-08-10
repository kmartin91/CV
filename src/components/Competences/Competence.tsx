import React from 'react'
import PropTypes from 'prop-types'
import Level from '../Level/Level'
import './Competence.scss'

interface PropsInterface {
  competence: CompetenceInterface
}

const Competence = ({ competence }: PropsInterface) => {
  if (!competence) return null
  const { name, value }: CompetenceInterface = competence
  return (
    <article className="Competence">
      <span className="nameSkill">{name}</span>
      <Level level={value} />
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

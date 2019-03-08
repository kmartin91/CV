import React from 'react'
import Level from '../Level/Level'
import './Competence.scss'

const Competence = ({ competence }) => (
  <>
    <article className="Competence">
      <span className="nameSkill">{competence.name}</span>
      <Level level={competence.value} />
    </article>
  </>
)

export default Competence

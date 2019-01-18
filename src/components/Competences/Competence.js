import React from 'react'
import Level from '../Level/Level'

const Competence = ({ competence }) => (
  <>
    <article className="skills">
      <span className="nameSkill">{competence.name}</span>
      <Level level={competence.value} />
    </article>
    <div className="clear" />
  </>
)

export default Competence

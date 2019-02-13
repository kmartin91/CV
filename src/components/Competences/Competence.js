import React from 'react'
import Level from '../Level/Level'
import './Competence.css'

const Competence = ({ competence }) => (
  <>
    <article className="Competence">
      <span className="nameSkill">{competence.name}</span>
      <Level level={competence.value} />
    </article>
    <div className="clear" />
  </>
)

export default Competence

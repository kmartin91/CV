import React from 'react'
import './Experience.scss'

const Experience = ({ experience }) => (
  <article className="exp">
    <div className="headline">{experience.entreprise}</div>
    <div className="duration">
      {experience.dateDebut} à {experience.dateFin}
    </div>
    <div className="intitule">{experience.intitule}</div>
    <div className="description display-linebreak">{experience.description}</div>
    <div className="technologies">{experience.technologies}</div>
  </article>
)

export default Experience

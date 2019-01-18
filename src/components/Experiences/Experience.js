import React from 'react'

const Experience = ({ experience }) => (
  <article className="exp">
    <div className="headlineArticle">
      {experience.entreprise} ({experience.lieu})
    </div>
    <div className="duration">
      {experience.dateDebut} à {experience.dateFin}
    </div>
    <div className="clear" />
    <div className="intitule">{experience.intitule}</div>
    <div className="description display-linebreak">
      {experience.description}
    </div>
    <div className="technologies">{experience.technologies}</div>
  </article>
)

export default Experience

import React from 'react'
import PropTypes from 'prop-types'
import './Experience.scss'

interface ExperienceInterface {
  experience: {
    entreprise: string
    dateDebut: string
    dateFin: string
    intitule: string
    description: string
    technologies: string
  }
}

const Experience = ({ experience }: ExperienceInterface) => {
  if (!experience) return null

  return (
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
}

Experience.defaultProps = {
  experience: undefined,
}

Experience.propTypes = {
  experience: PropTypes.shape({
    entreprise: PropTypes.string.isRequired,
    dateDebut: PropTypes.string.isRequired,
    dateFin: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    intitule: PropTypes.string.isRequired,
    technologies: PropTypes.string.isRequired,
  }),
}

export default Experience

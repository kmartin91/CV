import React from 'react'
import PropTypes from 'prop-types'
import './Experience.scss'

interface PropsInterface {
  experience: ExperienceInterface
}

const Experience = ({ experience }: PropsInterface) => {
  if (!experience) return null

  const {
    entreprise,
    dateDebut,
    dateFin,
    description,
    intitule,
    technologies,
  }: ExperienceInterface = experience
  return (
    <article className="exp">
      <div className="headline">{entreprise}</div>
      <div className="duration">
        {dateDebut} à {dateFin}
      </div>
      <div className="intitule">{intitule}</div>
      <div className="description display-linebreak">{description}</div>
      <div className="technologies">{technologies}</div>
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

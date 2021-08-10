import React from 'react'
import PropTypes from 'prop-types'

import './Formation.scss'

interface PropsInterface {
  formation: FormationInterface
}

const Formation = ({ formation }: PropsInterface) => {
  if (!formation) return null

  const { nom, dateFin, dateDebut, description }: FormationInterface = formation
  return (
    <article className="formation">
      <div className="headline">{`${nom}`}</div>
      <div className="duration">{`${dateDebut} ${dateFin ? `- ${dateFin}` : ''}`}</div>
      <div className="description">{description}</div>
    </article>
  )
}

Formation.defaultProps = {
  formation: undefined,
}

Formation.propTypes = {
  formation: PropTypes.shape({
    nom: PropTypes.string,
    dateDebut: PropTypes.string,
    dateFin: PropTypes.string,
    description: PropTypes.string,
  }),
}

export default Formation

import React from 'react'
import PropTypes from 'prop-types'

import './Formation.scss'

interface FormationInterface {
  formation: {
    nom: string
    dateDebut: string
    dateFin: string
    description: string
  }
}

const Formation = ({ formation }: FormationInterface) => {
  if (!formation) return null

  return (
    <article className="formation">
      <div className="headline">{`${formation.nom}`}</div>
      <div className="duration">
        {`${formation.dateDebut} ${formation.dateFin ? `- ${formation.dateFin}` : ''}`}
      </div>
      <div className="description">{formation.description}</div>
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

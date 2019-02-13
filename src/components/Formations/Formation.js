import React from 'react'

const Formation = ({ formation }) => (
  <article className="formation">
    <div className="headline">{`${formation.nom} (${formation.lieu})`}</div>
    <div className="duration">
      {`${formation.dateDebut} ${formation.dateFin !== null ? `- ${formation.dateFin}` : ''}`}
    </div>
    <div className="clear" />
    <div className="description">{formation.description}</div>
  </article>
)

export default Formation

import React from 'react'
import _get from 'lodash/get'
import { useStaticQuery, graphql } from 'gatsby'
import { FaGraduationCap } from 'react-icons/fa'
import Formation from './Formation'

const Formations = () => {
  const data = useStaticQuery(graphql`
    query FormationData {
      dataJson {
        formations {
          nom
          lieu
          description
          dateDebut
          dateFin
        }
      }
    }
  `)
  return (
    <>
      <div className="title">
        <FaGraduationCap /> FORMATIONS
      </div>
      {_get(data, 'dataJson.formations', []).map((formation, index) => (
        <Formation formation={formation} key={index} />
      ))}
    </>
  )
}

export default Formations

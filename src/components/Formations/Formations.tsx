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
          description
          dateDebut
          dateFin
        }
      }
    }
  `)
  return (
    <React.Fragment>
      <div className="title">
        <FaGraduationCap /> FORMATIONS
      </div>
      {_get(data, 'dataJson.formations', []).map((formation: FormationInterface, index: number) => (
        <Formation formation={formation} key={index} />
      ))}
    </React.Fragment>
  )
}

export default Formations

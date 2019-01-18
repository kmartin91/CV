import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaGraduationCap } from 'react-icons/fa'
import Formation from './Formation'

const Formations = () => (
  <StaticQuery
    query={graphql`
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
    `}
    render={data => {
      const formations = _get(data, 'dataJson.formations', [])
      return (
        <>
          <span className="title">
            <FaGraduationCap /> FORMATIONS
          </span>
          {formations.map((formation, index) => (
            <Formation formation={formation} key={index} />
          ))}
        </>
      )
    }}
  />
)

export default Formations

import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaGraduationCap } from 'react-icons/fa'
import Formation from './Formation'

const query = graphql`
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
`

const Formations = () => (
  <StaticQuery
    query={query}
    render={data => (
      <>
        <span className="title">
          <FaGraduationCap /> FORMATIONS
        </span>
        {_get(data, 'dataJson.formations', []).map((formation, index) => (
          <Formation formation={formation} key={index} />
        ))}
      </>
    )}
  />
)

export default Formations

import React from 'react'
import _get from 'lodash/get'
import { FaDesktop } from 'react-icons/fa'
import { useStaticQuery, graphql } from 'gatsby'

import CompetencesList from './CompetencesList'

const Competences = () => {
  const data = useStaticQuery(graphql`
    query CompetenceData {
      dataJson {
        competences {
          label
          values {
            name
            value
          }
        }
      }
    }
  `)
  return (
    <>
      <div className="title">
        <FaDesktop /> COMPETENCES
      </div>
      {_get(data, 'dataJson.competences', []).map((subcompetence, index) => {
        return <CompetencesList key={index} competenceslist={subcompetence} />
      })}
    </>
  )
}

export default Competences

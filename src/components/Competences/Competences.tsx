import { graphql, useStaticQuery } from 'gatsby'
import _get from 'lodash/get'
import React from 'react'
import { FaDesktop } from 'react-icons/fa'

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
    <React.Fragment>
      <div className="title">
        <FaDesktop /> COMPETENCES
      </div>
      {_get(data, 'dataJson.competences', []).map(
        (subcompetence: CompetencesInterface, index: number) => {
          return <CompetencesList key={index} competencesList={subcompetence} />
        },
      )}
    </React.Fragment>
  )
}

export default Competences

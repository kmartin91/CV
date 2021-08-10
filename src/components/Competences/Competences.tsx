import React from 'react'
import _get from 'lodash/get'
import { FaDesktop } from 'react-icons/fa'
import { useStaticQuery, graphql } from 'gatsby'

import CompetencesList from './CompetencesList'

interface CompetenceInterface {
  label: string
  values: Array<{ value: string; name: string }>
}

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
        (subcompetence: CompetenceInterface, index: number) => {
          return <CompetencesList key={index} competencesList={subcompetence} />
        },
      )}
    </React.Fragment>
  )
}

export default Competences

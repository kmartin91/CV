import React from 'react'
import _get from 'lodash/get'
import { FaDesktop } from 'react-icons/fa'
import { StaticQuery, graphql } from 'gatsby'

import CompetencesList from './CompetencesList'

const query = graphql`
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
`

const Competences = () => (
  <StaticQuery
    query={query}
    render={data => {
      const dataJson = _get(data, 'dataJson', {})
      const { competences } = dataJson
      return (
        <>
          <span className="title">
            <FaDesktop /> COMPETENCES
          </span>
          {competences.map((subcompetence, index) => {
            return (
              <CompetencesList key={index} competenceslist={subcompetence} />
            )
          })}
        </>
      )
    }}
  />
)

export default Competences

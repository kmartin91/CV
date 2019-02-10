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
    render={data => (
      <>
        <span className="title">
          <FaDesktop /> COMPETENCES
        </span>
        {_get(data, 'dataJson.competences', []).map((subcompetence, index) => {
          return <CompetencesList key={index} competenceslist={subcompetence} />
        })}
      </>
    )}
  />
)

export default Competences

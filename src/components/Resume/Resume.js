import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaInfoCircle } from 'react-icons/fa'

const query = graphql`
  query InformationData {
    dataJson {
      information
    }
  }
`

const Resume = () => (
  <StaticQuery
    query={query}
    render={data => (
      <article className="resume">
        <span className="title">
          <FaInfoCircle /> INFORMATIONS
        </span>
        <div className="display-linebreak">{_get(data, 'dataJson.information', '')}</div>
      </article>
    )}
  />
)

export default Resume

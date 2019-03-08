import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaAddressBook } from 'react-icons/fa'
import Reference from './Reference'

const query = graphql`
  query ReferenceData {
    dataJson {
      references {
        name
        job
      }
    }
  }
`

const References = () => (
  <StaticQuery
    query={query}
    render={data => (
      <>
        <div className="title">
          <FaAddressBook /> REFERENCES
        </div>
        {_get(data, 'dataJson.references', []).map((reference, index) => (
          <Reference reference={reference} key={index} />
        ))}

        <div className="refInfo">Pour avoir les coordonnées des références contactez-moi</div>
      </>
    )}
  />
)

export default References

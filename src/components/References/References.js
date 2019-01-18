import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaAddressBook } from 'react-icons/fa'
import Reference from './Reference'

const References = () => (
  <StaticQuery
    query={graphql`
      query ReferenceData {
        dataJson {
          references {
            name
            job
          }
        }
      }
    `}
    render={data => {
      const references = _get(data, 'dataJson.references', [])
      return (
        <>
          <span className="title">
            <FaAddressBook /> REFERENCES
          </span>
          {references.map((reference, index) => (
            <Reference reference={reference} key={index} />
          ))}

          <div className="refInfo">
            Pour avoir les coordonnées des références contactez-moi
          </div>
        </>
      )
    }}
  />
)

export default References

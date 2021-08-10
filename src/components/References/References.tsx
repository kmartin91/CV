import React from 'react'
import _get from 'lodash/get'
import { useStaticQuery, graphql } from 'gatsby'
import { FaAddressBook } from 'react-icons/fa'
import Reference from './Reference'

const References = () => {
  const data = useStaticQuery(graphql`
    query ReferenceData {
      dataJson {
        references {
          name
          job
        }
      }
    }
  `)
  return (
    <React.Fragment>
      <div className="title">
        <FaAddressBook /> REFERENCES
      </div>
      {_get(data, 'dataJson.references', []).map((reference: ReferenceInterface, index: number) => (
        <Reference reference={reference} key={index} />
      ))}

      <div className="refInfo">Pour avoir les coordonnées des références contactez-moi</div>
    </React.Fragment>
  )
}

export default References

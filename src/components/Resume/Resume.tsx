import React from 'react'
import _get from 'lodash/get'
import { useStaticQuery, graphql } from 'gatsby'
import { FaInfoCircle } from 'react-icons/fa'

import './Resume.scss'

const Resume = () => {
  const data = useStaticQuery(graphql`
    query InformationData {
      dataJson {
        information
      }
    }
  `)

  return (
    <article className="resume">
      <div className="title">
        <FaInfoCircle /> INFORMATIONS
      </div>
      <div className="display-linebreak">{_get(data, 'dataJson.information', '')}</div>
    </article>
  )
}

export default Resume

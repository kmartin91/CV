import React from 'react'
import _get from 'lodash/get'
import { useStaticQuery, graphql } from 'gatsby'
import { FaBed } from 'react-icons/fa'

import './Passions.scss'

const Passions = () => {
  const data = useStaticQuery(graphql`
    query PassionData {
      dataJson {
        passions
      }
    }
  `)

  return (
    <React.Fragment>
      <div className="title">
        <FaBed />
        {` PASSIONS`}
      </div>
      <article className="passions">
        {_get(data, 'dataJson.passions', []).map((passion, index) => (
          <span className="passion" key={index}>
            {passion}
          </span>
        ))}
      </article>
    </React.Fragment>
  )
}

export default Passions

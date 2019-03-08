import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaBed } from 'react-icons/fa'

const query = graphql`
  query PassionData {
    dataJson {
      passions
    }
  }
`

const Passions = () => (
  <StaticQuery
    query={query}
    render={data => (
      <>
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
      </>
    )}
  />
)

export default Passions

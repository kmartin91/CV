import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaBed } from 'react-icons/fa'

const Passions = () => (
  <StaticQuery
    query={graphql`
      query PassionData {
        dataJson {
          passions
        }
      }
    `}
    render={data => {
      const passions = _get(data, 'dataJson.passions', [])
      return (
        <>
          <span className="title">
            <FaBed />
            {` PASSIONS`}
          </span>
          <article className="passions">
            {passions.map((passion, index) => (
              <span className="passion" key={index}>
                {passion}
              </span>
            ))}
          </article>
        </>
      )
    }}
  />
)

export default Passions

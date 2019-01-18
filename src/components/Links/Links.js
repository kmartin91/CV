import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaLink } from 'react-icons/fa'
import Link from './Link'

const Links = () => (
  <StaticQuery
    query={graphql`
      query LinkData {
        dataJson {
          links {
            icon
            name
            url
          }
        }
      }
    `}
    render={data => {
      const links = _get(data, 'dataJson.links', [])
      return (
        <>
          <span className="title">
            <FaLink /> LIENS
          </span>
          <ul>
            {links.map((link, index) => (
              <Link link={link} key={index} />
            ))}
          </ul>
        </>
      )
    }}
  />
)

export default Links

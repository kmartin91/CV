import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaLink } from 'react-icons/fa'
import Link from './Link'

import './Links.scss'

const query = graphql`
  query LinkData {
    dataJson {
      links {
        icon
        name
        url
      }
    }
  }
`

const Links = () => (
  <StaticQuery
    query={query}
    render={data => (
      <>
        <div className="title">
          <FaLink /> LIENS
        </div>
        <ul className="Links">
          {_get(data, 'dataJson.links', []).map((link, index) => (
            <Link link={link} key={index} />
          ))}
        </ul>
      </>
    )}
  />
)

export default Links

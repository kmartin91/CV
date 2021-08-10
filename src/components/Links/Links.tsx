import React from 'react'
import _get from 'lodash/get'
import { useStaticQuery, graphql } from 'gatsby'
import { FaLink } from 'react-icons/fa'
import Link from './Link'

import './Links.scss'

interface LinkInterface {
  icon: string
  url: string
  name: string
}

const Links = () => {
  const data = useStaticQuery(graphql`
    query LinkData {
      dataJson {
        links {
          icon
          name
          url
        }
      }
    }
  `)

  return (
    <React.Fragment>
      <div className="title">
        <FaLink /> LIENS
      </div>
      <ul className="Links">
        {_get(data, 'dataJson.links', []).map((link: LinkInterface, index: number) => (
          <Link link={link} key={index} />
        ))}
      </ul>
    </React.Fragment>
  )
}

export default Links

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import Avatar from './Avatar'

import './Header.scss'

const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          lastname
          firstname
          job
        }
      }
    }
  `)
  return (
    <React.Fragment>
      <header className="header">
        <h1 className="logo">{`${data.site.siteMetadata.firstname} ${data.site.siteMetadata.lastname}`}</h1>
        <h2 className="intro">{data.site.siteMetadata.job}</h2>
      </header>
      <Avatar alt={`${data.site.siteMetadata.firstname} ${data.site.siteMetadata.lastname}`} />
    </React.Fragment>
  )
}

export default Header

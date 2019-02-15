import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import AwesomeKevinMartinProfilePicture from './Avatar'

import './Header.scss'

const query = graphql`
  query {
    site {
      siteMetadata {
        lastname
        firstname
        job
      }
    }
  }
`

const Header = () => (
  <StaticQuery
    query={query}
    render={data => (
      <header className="header">
        <h1 className="logo">{`${data.site.siteMetadata.firstname} ${
          data.site.siteMetadata.lastname
        }`}</h1>
        <h2 className="intro">{data.site.siteMetadata.job}</h2>
        <AwesomeKevinMartinProfilePicture
          alt={`${data.site.siteMetadata.firstname} ${data.site.siteMetadata.lastname}`}
          className="photo"
        />
      </header>
    )}
  />
)

export default Header

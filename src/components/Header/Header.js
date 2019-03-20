import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import AwesomeKevinMartinProfilePicture from './Avatar'

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
  )
}

export default Header

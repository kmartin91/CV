import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

import './Header.scss'

const query = graphql`
  query {
    placeholderImage: file(relativePath: { eq: "kevin.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    site {
      siteMetadata {
        lastname
        firstname
        job
      }
    }
  }
`

const AwesomeKevinMartinProfilePicture = () => (
  <StaticQuery
    query={query}
    render={data => <Img className="photo" fluid={data.placeholderImage.childImageSharp.fluid} />}
  />
)

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
          alt={`${data.firstname} ${data.lastname}`}
          className="photo"
        />
      </header>
    )}
  />
)

export default Header

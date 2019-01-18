import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const AwesomeKevinMartinProfilePicture = () => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "kevin.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => (
      <Img
        className="photo"
        fluid={data.placeholderImage.childImageSharp.fluid}
      />
    )}
  />
)

const Header = () => (
  <header className="header">
    <span className="logo">Kévin MARTIN</span>
    <span className="intro">DÉVELOPPEUR FULLSTACK</span>
    <AwesomeKevinMartinProfilePicture alt="Kevin MARTIN" className="photo" />
  </header>
)

export default Header

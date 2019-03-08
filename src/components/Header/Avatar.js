import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const query = graphql`
  query {
    placeholderImage: file(relativePath: { eq: "avatar.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default () => (
  <StaticQuery
    query={query}
    render={data => <Img className="photo" fluid={data.placeholderImage.childImageSharp.fluid} />}
  />
)

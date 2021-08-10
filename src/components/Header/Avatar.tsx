import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const Avatar = ({ alt }: AvatarInterface) => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "avatar.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return <Img alt={alt} className="photo" fluid={data.placeholderImage.childImageSharp.fluid} />
}

Avatar.defaultProps = {
  alt: 'Kevin MARTIN',
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
}

export default Avatar

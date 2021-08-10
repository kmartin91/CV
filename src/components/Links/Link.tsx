import React from 'react'
import Proptypes from 'prop-types'
import { FaGithub, FaLinkedin, FaCode, FaViadeo, FaFileCode } from 'react-icons/fa'

import './Link.scss'

interface LinkInterface {
  link: {
    icon: string
    url: string
    name: string
  }
}

const getIcon = (icon: string) => {
  switch (icon) {
    case 'github':
      return <FaGithub />
    case 'linkedin':
      return <FaLinkedin />
    case 'code':
      return <FaCode />
    case 'viadeo':
      return <FaViadeo />
    case 'fileCode':
      return <FaFileCode />
    default:
      return <FaCode />
  }
}

const Link = ({ link }: LinkInterface) => {
  if (!link) return null

  return (
    <li className="Link">
      {getIcon(link.icon)}
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.name}
      </a>
    </li>
  )
}

Link.defaultProps = {
  link: undefined,
}

Link.propTypes = {
  link: Proptypes.shape({
    icon: Proptypes.string.isRequired,
    url: Proptypes.string.isRequired,
    name: Proptypes.string.isRequired,
  }),
}

export default Link

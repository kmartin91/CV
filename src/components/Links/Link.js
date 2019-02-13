import React from 'react'
import { FaGithub, FaLinkedin, FaCode, FaViadeo, FaFileCode } from 'react-icons/fa'

import './Link.css'

const getIcon = icon => {
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

const Link = ({ link }) => (
  <li className="Link">
    {getIcon(link.icon)}
    <a href={link.url} target="_blank" rel="noopener noreferrer">
      {link.name}
    </a>
  </li>
)

export default Link

import React from 'react'
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaViadeo,
  FaFileCode,
} from 'react-icons/fa'

const getIcon = icon => {
  switch (icon) {
    case 'github':
      return <FaGithub />
      break
    case 'linkedin':
      return <FaLinkedin />
      break
    case 'code':
      return <FaCode />
      break
    case 'viadeo':
      return <FaViadeo />
      break
    case 'fileCode':
      return <FaFileCode />
      break
    default:
      return <FaCode />
      break
  }
}

const Link = ({ link }) => (
  <li>
    {getIcon(link.icon)}
    <a href={link.url} target="_blank" rel="noopener noreferrer">
      {link.name}
    </a>
  </li>
)

export default Link

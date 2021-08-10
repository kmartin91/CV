import React from 'react'
import Proptypes from 'prop-types'
import { FaGithub, FaLinkedin, FaCode, FaViadeo, FaFileCode } from 'react-icons/fa'

import './Link.scss'

interface PropsInterface {
  link: LinkInterface
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

const Link = ({ link }: PropsInterface) => {
  if (!link) return null

  const { icon, url, name }: LinkInterface = link

  return (
    <li className="Link">
      {getIcon(icon)}
      <a href={url} target="_blank" rel="noopener noreferrer">
        {name}
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

import React from 'react'
import { FaInfoCircle } from 'react-icons/fa'

const Resume = ({ information }) => (
  <article className="resume">
    <span className="title">
      <FaInfoCircle /> INFORMATIONS
    </span>
    <div className="display-linebreak">{information}</div>
  </article>
)

export default Resume

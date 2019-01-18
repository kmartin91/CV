import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaBlackTie } from 'react-icons/fa'
import Experience from './Experience'

const Experiences = () => (
  <StaticQuery
    query={graphql`
      query ExperienceData {
        dataJson {
          experiences {
            entreprise
            intitule
            lieu
            dateDebut
            dateFin
            description
            technologies
          }
        }
      }
    `}
    render={data => {
      const experiences = _get(data, 'dataJson.experiences', [])
      return (
        <>
          <span className="title">
            <FaBlackTie /> EXPERIENCES PROFESSIONNELLES
          </span>
          {experiences.map((experience, index) => (
            <Experience experience={experience} key={index} />
          ))}
        </>
      )
    }}
  />
)

export default Experiences

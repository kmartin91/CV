import React from 'react'
import _get from 'lodash/get'
import { StaticQuery, graphql } from 'gatsby'
import { FaBlackTie } from 'react-icons/fa'
import Experience from './Experience'

const query = graphql`
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
`

const Experiences = () => (
  <StaticQuery
    query={query}
    render={data => (
      <>
        <div className="title">
          <FaBlackTie /> EXPERIENCES PROFESSIONNELLES
        </div>
        {_get(data, 'dataJson.experiences', []).map((experience, index) => (
          <Experience experience={experience} key={index} />
        ))}
      </>
    )}
  />
)

export default Experiences

import React from 'react'
import renderer from 'react-test-renderer'
import Experiences from './Experiences'
import { useStaticQuery } from 'gatsby'

describe('Experiences component', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementationOnce(() => ({
      dataJson: {
        experiences: [
          {
            entreprise: 'Groupe Renault',
            intitule: 'Ingénieur Etude et développement',
            dateDebut: 'Janvier 2018',
            dateFin: "Aujourd'hui",
            description: '- Création de module & gestion des sites du groupe Renault)\n',
            technologies:
              'Technologies utilisées: HTML 5, CSS 3, Javascript, Docker\nFramework/Librairies utilisés: React, Vue.JS, Svelte, Node',
          },
          {
            entreprise: 'Niji',
            intitule: 'Ingénieur Etude et développement',
            dateDebut: 'Novembre 2017',
            dateFin: 'Janvier 2018',
            description: '- Création de features pour les sites du groupe Louvre Hotels\n',
            technologies:
              'Technologies utilisées: HTML 5, CSS 3, Javascript Framework utilisé: React',
          },
        ],
      },
    }))
  })

  it('should render correctly', () => {
    const component = renderer.create(<Experiences />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

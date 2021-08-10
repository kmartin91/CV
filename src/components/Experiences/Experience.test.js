import React from 'react'
import renderer from 'react-test-renderer'
import Experience from './Experience'

const mocks = {
  experience: {
    entreprise: 'Groupe Renault',
    intitule: 'Ingénieur Etude et développement',
    dateDebut: 'Janvier 2018',
    dateFin: "Aujourd'hui",
    description: '- Création de module & gestion des sites du groupe Renault)\n',
    technologies:
      'Technologies utilisées: HTML 5, CSS 3, Javascript, Docker\nFramework/Librairies utilisés: React, Vue.JS, Svelte, Node',
  },
}

describe('Experience component', () => {
  it('should render correctly with props', () => {
    const component = renderer.create(<Experience {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<Experience />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

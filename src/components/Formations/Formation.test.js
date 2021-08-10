import React from 'react'
import _cloneDeep from 'lodash/cloneDeep'
import renderer from 'react-test-renderer'
import Formation from './Formation'

const mocks = {
  formation: {
    nom: 'Docker for entreprise',
    description: 'Formation officiel Docker US',
    dateDebut: 'Avril 2017',
  },
}

describe('Formation component', () => {
  it('should render correctly with props', () => {
    const component = renderer.create(<Formation {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<Formation />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly with endate', () => {
    const clonedMocks = _cloneDeep(mocks)
    clonedMocks.formation.dateFin = 'Janvier 2019'
    const component = renderer.create(<Formation {...clonedMocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

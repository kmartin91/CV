import React from 'react'
import renderer from 'react-test-renderer'
import Formations from './Formations'
import { useStaticQuery } from 'gatsby'

jest.mock('./Formation', () => 'mock-formation')

describe('Formations component', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementationOnce(() => ({
      dataJson: {
        formations: [
          {
            nom: 'Docker for entreprise',
            description: 'Formation officiel Docker US',
            dateDebut: 'Avril 2017',
          },
        ],
      },
    }))
  })

  it('should render correctly', () => {
    const component = renderer.create(<Formations />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

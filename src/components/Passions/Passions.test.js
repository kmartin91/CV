import React from 'react'
import renderer from 'react-test-renderer'
import Passions from './Passions'
import { useStaticQuery } from 'gatsby'

beforeEach(() => {
  useStaticQuery.mockImplementationOnce(() => ({
    dataJson: {
      passions: ['CREATION MUSICALE', 'FOOTBALL', 'INFORMATIQUE', 'JEUX-VIDEO', 'MECANIQUE'],
    },
  }))
})

describe('Passions component', () => {
  it('should render correctly', () => {
    const component = renderer.create(<Passions />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

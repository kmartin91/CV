import React from 'react'
import renderer from 'react-test-renderer'
import Competence from './Competence'

const mocks = {
  competence: {
    name: 'Javascript',
    value: '4.5',
  },
}

jest.mock('../Level/Level', () => 'mock-level')

describe('Competence component', () => {
  it('should render correctly with props', () => {
    const component = renderer.create(<Competence {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<Competence />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

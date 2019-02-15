import React from 'react'
import renderer from 'react-test-renderer'
import Reference from './Reference'

const mocks = {
  reference: {
    name: 'Roberto Carlos',
    job: 'Best player eva',
  },
}

describe('Reference component', () => {
  it('should render correctly with props', () => {
    const component = renderer.create(<Reference {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<Reference />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

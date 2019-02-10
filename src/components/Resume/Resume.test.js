import React from 'react'
import renderer from 'react-test-renderer'
import Resume from './Resume'

const mocks = {}

describe('Resume component', () => {
  it('should render correctly', () => {
    const component = renderer.create(<Resume {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<Resume />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

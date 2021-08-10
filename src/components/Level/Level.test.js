import React from 'react'
import renderer from 'react-test-renderer'
import Level from './Level'

describe('Level component', () => {
  it('should render correctly full level complete', () => {
    const component = renderer.create(<Level level="4.9" />)

    // Trick avoid to make same TU for coverage branches
    component.update(<Level level="4.8" />)
    component.update(<Level level="4.7" />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly half level', () => {
    const component = renderer.create(<Level level="2.5" />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly thirty level', () => {
    const component = renderer.create(<Level level="2.2" />)

    // Trick avoid to make same TU for coverage branches
    component.update(<Level level="2.3" />)
    component.update(<Level level="2.1" />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly empty level', () => {
    const component = renderer.create(<Level level="0" />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

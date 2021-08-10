import React from 'react'
import renderer from 'react-test-renderer'
import _cloneDeep from 'lodash/cloneDeep'
import Link from './Link'

const mocks = {
  link: {
    icon: 'icon',
    url: 'url',
    name: 'name',
  },
}

describe('Link component', () => {
  it('should render correctly with props', () => {
    const component = renderer.create(<Link {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<Link />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly linkedin icon', () => {
    const clonedMocks = _cloneDeep(mocks)
    clonedMocks.link.icon = 'linkedin'

    const component = renderer.create(<Link {...clonedMocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('should render correctly code icon', () => {
    const clonedMocks = _cloneDeep(mocks)
    clonedMocks.link.icon = 'code'

    const component = renderer.create(<Link {...clonedMocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly viadeo icon', () => {
    const clonedMocks = _cloneDeep(mocks)
    clonedMocks.link.icon = 'viadeo'

    const component = renderer.create(<Link {...clonedMocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly github icon', () => {
    const clonedMocks = _cloneDeep(mocks)
    clonedMocks.link.icon = 'github'

    const component = renderer.create(<Link {...clonedMocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly fileCode icon', () => {
    const clonedMocks = _cloneDeep(mocks)
    clonedMocks.link.icon = 'fileCode'

    const component = renderer.create(<Link {...clonedMocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

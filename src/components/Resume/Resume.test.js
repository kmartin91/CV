import React from 'react'
import renderer from 'react-test-renderer'
import Resume from './Resume'
import { StaticQuery } from 'gatsby'

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      dataJson: {
        information: 'bla bla bla',
      },
    })
  )
})

describe('Resume component', () => {
  it('should render correctly', () => {
    const component = renderer.create(<Resume />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

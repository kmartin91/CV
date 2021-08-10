import React from 'react'
import renderer from 'react-test-renderer'
import { useStaticQuery } from 'gatsby'
import Links from './Links'

describe('Links component', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementationOnce(() => ({
      dataJson: {
        links: [
          {
            icon: 'icon',
            url: 'url',
            name: 'name',
          },
        ],
      },
    }))
  })

  it('should render correctly', () => {
    const component = renderer.create(<Links />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

import React from 'react'
import renderer from 'react-test-renderer'

import Header from './Header'
import { StaticQuery } from 'gatsby'

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          lastname: 'Martin',
          firstname: 'Kevin',
          job: 'Génie du mal',
        },
      },
    })
  )
})

jest.mock('./Avatar', () => 'mock-avatar')

describe('Header', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Header siteTitle="Default Starter" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

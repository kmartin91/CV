import React from 'react'
import renderer from 'react-test-renderer'
import { useStaticQuery } from 'gatsby'

import Avatar from './Avatar'

jest.mock('gatsby-image', () => 'mock-img')

beforeEach(() => {
  useStaticQuery.mockImplementationOnce(() => ({
    placeholderImage: {
      childImageSharp: {
        fluid: 'image',
      },
    },
  }))
})

describe('Avatar component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Avatar alt="alt" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

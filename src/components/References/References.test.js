import React from 'react'
import renderer from 'react-test-renderer'
import References from './References'
import { useStaticQuery } from 'gatsby'

describe('References component', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementationOnce(() => ({
      dataJson: {
        references: [
          {
            name: 'Snollebollekes',
            job: 'Bam bam singer',
          },
        ],
      },
    }))
  })

  it('should render correctly', () => {
    const component = renderer.create(<References />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

import React from 'react'
import renderer from 'react-test-renderer'
import References from './References'
import { StaticQuery } from 'gatsby'

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      dataJson: {
        references: {
          '1': {
            name: 'Snollebollekes',
            job: 'Bam bam singer',
          },
        },
      },
    })
  )
})

describe('References component', () => {
  it('should render correctly', () => {
    const component = renderer.create(<References />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

import React from 'react'
import renderer from 'react-test-renderer'
import Competences from './Competences'
import { useStaticQuery } from 'gatsby'

jest.mock('./CompetencesList', () => 'mock-competences-list')

describe('Competences component', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementationOnce(() => ({
      dataJson: {
        competences: [
          {
            label: 'Programmation',
            values: [
              {
                name: 'Javascript',
                value: '4.5',
              },
              {
                name: 'Node.JS',
                value: '3.6',
              },
            ],
          },
        ],
      },
    }))
  })

  it('should render correctly', () => {
    const component = renderer.create(<Competences />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

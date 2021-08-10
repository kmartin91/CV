import React from 'react'
import renderer from 'react-test-renderer'
import CompetencesList from './CompetencesList'

const mocks = {
  competencesList: {
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
}

jest.mock('./Competence', () => 'mock-competence')

describe('CompetencesList component', () => {
  it('should render correctly with props', () => {
    const component = renderer.create(<CompetencesList {...mocks} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly without props', () => {
    const component = renderer.create(<CompetencesList />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

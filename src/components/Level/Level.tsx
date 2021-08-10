import React from 'react'
import PropTypes from 'prop-types'
import './Level.css'

interface LevelInterface {
  level: string
}

// TODO Refactor this sh**

const Level = ({ level }: LevelInterface) => {
  const levelValue = parseFloat(level)
  const decimal = Math.floor((levelValue - Math.floor(levelValue)) * 10)
  const max = 5
  const full = Math.floor(levelValue)
  const white = max - full - 1
  let decimalClass = 'skill half'
  switch (decimal) {
    case 0:
      decimalClass = 'skill'
      break
    case 1:
    case 2:
    case 3:
      decimalClass = 'skill thirty'
      break
    case 7:
    case 8:
    case 9:
      decimalClass = 'skill seventy'
      break
    default:
      decimalClass = 'skill half'
      break
  }
  return (
    <div className="skillList">
      {Array(full)
        .fill(0)
        .map((_e: number, i: number) => (
          <span key={i} className="skill full" />
        ))}
      <span className={decimalClass} />
      {Array(white)
        .fill(0)
        .map((_e: number, i: number) => (
          <span key={i} className="skill" />
        ))}
    </div>
  )
}

Level.propTypes = {
  level: PropTypes.string.isRequired,
}

export default Level

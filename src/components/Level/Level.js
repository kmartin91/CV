import React from 'react'
import './Level.css'

const Level = ({ level }) => {
  const levelValue = level
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
        .fill()
        .map((e, i) => (
          <span key={i} className="skill full" />
        ))}
      <span className={decimalClass} />
      {Array(white)
        .fill()
        .map((e, i) => (
          <span key={i} className="skill" />
        ))}
    </div>
  )
}

export default Level

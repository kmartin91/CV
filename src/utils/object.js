function* values(obj) {
  for (let prop of Object.keys(obj)) yield obj[prop]
}

const toArray = obj => Array.from(values(obj))

export const get = (arr, key, defaultValue) => {
  console.log(toArray(arr))
  return Array.isArray(arr) ? arr[key] : toArray(arr)[0][key] || defaultValue
}

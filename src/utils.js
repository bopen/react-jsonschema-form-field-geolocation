export const coordValidation = (val, coord) => {
  switch (coord) {
    case 'lat':
      return val > -90.0 && val < 90.0
    case 'lng':
      return val > -180.0 && val < 180.0
    default:
      return false
  }
}

export const computeValue = (rawValue, oldValue, coord) => {
  if (!rawValue.match(/^-?\d*\.?\d*$/)) {
    return [oldValue, true]
  }
  if (!rawValue) {
    return [undefined, false]
  }
  if (rawValue.endsWith('.')) {
    // Special case for final "."
    return [rawValue, true]
  }
  const nextValue = parseFloat(rawValue)
  if (isNaN(nextValue)) {
    return [rawValue, true]
  }
  if (!coordValidation(nextValue, coord)) {
    return [oldValue, true]
  }
  return [nextValue, false]
}

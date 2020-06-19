export default class StringUtils extends String {
  constructor() {
    super()
  }
  public unitTransfer(source: string) {
    // TODO unitMap
    const unitMap = {
      '立方米': 'm³',
      '千克': 'kg',
      '克': 'g'
    }
    return source.replace(/立方米/g, 'm³')
  }
}
export const unitTransfer = (source: string) => {
  // TODO unitMap
  const unitMap = {
    '立方米': 'm³',
    '千克': 'kg',
    '克': 'g'
  }
  return source.replace(/立方米/g, 'm³')
}
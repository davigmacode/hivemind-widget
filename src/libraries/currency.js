const currency = (val, n, x, s, c) => {
  val = Number(val)
  if (val === 0) return 0

  n = n || 0
  x = x || 3
  s = s || ','

  let re = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\D' : '$') + ')'
  let num = val.toFixed(Math.max(0, ~~n))

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + s)
}

export default currency
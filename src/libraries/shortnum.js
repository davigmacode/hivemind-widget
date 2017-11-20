/**
 * Shorten number to thousands, millions, billions, etc.
 * http://en.wikipedia.org/wiki/Metric_prefix
 *
 * @param {number} num Number to shorten.
 * @param {number} [digits=0] The number of digits to appear after the decimal point.
 * @returns {string|number}
 *
 * @example
 * // returns '12.5k'
 * shortnum(12543, 1)
 *
 * @example
 * // returns '-13k'
 * shortenLargeNumber(-12567)
 *
 * @example
 * // returns '51M'
 * shortnum(51000000)
 *
 * @example
 * // returns 651
 * shortnum(651)
 *
 * @example
 * // returns 0.12345
 * shortnum(0.12345)
 */

const shortnum = (num, digits = 1) => {
  let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  let decimal

  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1)

    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i]
    }
  }

  return num
}

export default shortnum

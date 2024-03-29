/**
 * Convert a date string from API to a Date object
 *
 * @see {@link https://github.com/clashperk/clashofclans.js/blob/main/src/util/Util.ts#L84}
 * @param date - date string from the API
 * @returns The date as a Date object
 */
function convertApiDate(date: string) {
  const yearMonthDay = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(
    6,
    8
  )}`;
  const hoursMinutesSeconds = `${date.slice(9, 11)}:${date.slice(
    11,
    13
  )}:${date.slice(13)}`;
  return new Date(`${yearMonthDay}T${hoursMinutesSeconds}`);
}

/**
 * Fixes tags to be in the correct format
 *
 * @see {@link https://github.com/clashperk/clashofclans.js/blob/main/src/util/Util.ts#L33}
 * @param tag - The tag to format
 * @returns string
 */
function formatTag(tag: string) {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  return `#${tag
    .toUpperCase()
    .replace(/O/g, '0')
    .replace(/^#/g, '')
    .replace(/\s/g, '')}`;
}

/**
 * Verifies a tag is valid
 *
 * @see {@link https://github.com/clashperk/clashofclans.js/blob/main/src/util/Util.ts#L46}
 * @param tag - The tag to verify
 * @returns boolean
 */
function verifyTag(tag: string) {
  // eslint-disable-next-line unicorn/better-regex
  return /^#?[0289PYLQGRJCUV]{3,}$/.test(tag);
}

export { convertApiDate, formatTag, verifyTag };

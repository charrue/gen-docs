/**
 * @description Get the formatted date according to the string of tokens passed in
 * @param { Date } date Date
 * @see https://day.js.org/docs/en/display/format
 *
 * @example
 * formatDate()
 * formatDate(new Date())
 *
 * @returns {string} Formatted date
 */
const formatDate = (date?: Date): string => dayjs(date).format("YYYY-MM-DD");

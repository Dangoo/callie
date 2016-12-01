/**
 * Creates a new array with indexes as items and shifts them by given amount
 *
 * @param   length  Number Length of array to be created
 * @param   shiftBy Number Amount of by how many items the array should be
 *                  shifted
 * @returns         Array  Shifted array
 */
export function getShiftedArray(length, shiftBy) {
  // Create new array and use keys as items
  const items = [...Array(length).keys()];
  // Remove n last items and insert at the beginning
  return items.splice(-shiftBy).concat(items);
}

/**
 * Creates array with n entries and value as passed
 *
 * @param   n     Number Number of items in array
 * @param   value any    Value of each item, default null
 * @returns       Array
 */
export function getDummyArray(n, value = null) {
  const a = [];

  for (var i = n; i > 0; i--) {
    a.push(value);
  }

  return a;

  // Modern implementation if array.prototype.fill is available
  // return Array(n).fill(value);
}

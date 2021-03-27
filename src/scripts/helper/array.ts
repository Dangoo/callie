/**
 * Creates a new array with indexes as items and shifts them by given amount
 *
 * @param  {Number} length  Length of array to be created
 * @param  {Number} shiftBy Amount of by how many items the array should be
 *                          shifted
 * @return {Array}          Shifted array
 */
export function getShiftedArray(length: number, shiftBy: number): number[] {
  // Create new array and use keys as items
  // const items = [...Array(length).keys()]; // Temporarely disabled due to IE11 not supporting
  const items = getDummyArray(length);

  // Remove n last items and insert at the beginning
  return items.splice(-shiftBy).concat(items);
}

/**
 * Creates array with n entries and value as passed
 *
 * @param  {Number} n     Number of items in array
 * @param  {*}      value Value of each item
 * @return {Array}
 */
export function getDummyArray(n: number): number[];
export function getDummyArray<T>(n: number, value?: T): T[];
export function getDummyArray(n: number, value?: any){
  const a = [];

  for (var i = 0; i < n; i++) {
    a.push(typeof value !== 'undefined' ? value : i);
  }

  return a;

  // Modern implementation if array.prototype.fill is available
  // return Array(n).fill(value);
}

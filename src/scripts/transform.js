export function formatValue(valueString, format) {
  const parts = valueString.split('.');

  if (format === 'dd.mm.yyyy') {
    parts.reverse();
  }

  return parts.join('-');
}

/**
 * Creates a new array with indexes as items and shifts them by given amount
 *
 * @param   length  Number Length of array to be created
 * @param   shiftBy Number Amount of by how many items the array should be
 *                  shifted
 * @returns         Array  Shifted array
 */
function getSchiftedArray(length, shiftBy) {
  // Create new array and use keys as items
  const items = [...Array(length).keys()];
  // Remove n last items and insert at the beginning
  return items.splice(-shiftBy).concat(items);
}

const daysInWeekIndices = getSchiftedArray(7, 1);

/**
 * Shift index of day according to daysInWeekIndices declaration
 *
 * @param   dayIndex Number Index of day to become shifted
 * @returns          Number Shifted index
 */
function shiftDayIndex(dayIndex) {
  const days = daysInWeekIndices;
  return days[dayIndex];
}

/**
 * Creates array with n entries and value as passed
 *
 * @param   n     Number Number of items in array
 * @param   value any    Value of each item, default null
 * @returns       Array
 */
function getDummyArray(n, value = null) {
  const a = [];

  for (var i = n; i > 0; i--) {
    a.push(value);
  }

  return a;

  // Modern implementation if array.prototype.fill is available
  // return Array(n).fill(value);
}

/**
 * Fill the margin of days from other months days in first/last week
 *
 * @param   daysInMonth Array Days of month
 * @returns             Array
 */
export function fillMonth(daysInMonth, weeksPerMonth, daysPerWeek) {

  const maxDaysInMonth = daysPerWeek * weeksPerMonth;
  const firstDayIndex = shiftDayIndex(daysInMonth[0].day);
  let daysInPreviousMonth = [];
  let daysInNextMonth = [];
  const deltaToPrevMonth = firstDayIndex;
  const deltaToNextMonth = (
    maxDaysInMonth - (daysInMonth.length + firstDayIndex)
  ) % daysPerWeek;

  // for display with monday as first day of week
  if (deltaToPrevMonth > 0) {
    daysInPreviousMonth = getDummyArray(firstDayIndex, null);
  }

  if ((deltaToNextMonth > 0) && (deltaToNextMonth <= weeksPerMonth)) {
    daysInNextMonth = getDummyArray(deltaToNextMonth, null);
  }

  return {
    daysInPreviousMonth: daysInPreviousMonth,
    daysInMonth: daysInMonth,
    daysInNextMonth: daysInNextMonth
  };
}

export function assignState(list, childrenKey) {
  const items = list.map((val) => {
    if (!val) {
      return;
    }

    const className = [];
    val.current && className.push('current');
    val.selected && className.push('selected');

    return convertToAST(
      val[childrenKey],
      {
        className
      }
    );
  });

  return items;
}

export function convertToAST(children, attrs) {
  return Object.assign({
    children
  }, attrs)
}

export function splitMonthInWeeks(days, weeksPerMonth, daysPerWeek) {
  const weeks = [];


  for (var i = weeksPerMonth - 1; i >= 0; i--) {
    // TODO: Refactor with %
    const daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * i + daysPerWeek);
    const dateNames = assignState(daysInWeek, 'date');

    weeks.unshift(dateNames);
  }

  return weeks;
}


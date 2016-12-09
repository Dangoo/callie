import {
  getShiftedArray,
  getDummyArray
} from './helper/array';

/**
 * Shift index of day according to daysInWeekIndices declaration
 *
 * @param   dayIndex Number Index of day to become shifted
 * @returns          Number Shifted index
 */
function shiftDayIndex(dayIndex, shiftRule) {
  return shiftRule[dayIndex];
}

/**
 * Fill the margin of days from other months days in first/last week
 *
 * @param   daysInMonth Array Days of month
 * @returns             Array
 */
export function fillMonth(daysInMonth, weeksPerMonth, daysPerWeek) {

  const maxDaysInMonth = daysPerWeek * weeksPerMonth;
  const firstDayIndex = shiftDayIndex(
    daysInMonth[0].day,
    getShiftedArray(7, 1)
  );
  const deltaToPrevMonth = firstDayIndex;
  const deltaToNextMonth = (
    maxDaysInMonth - (daysInMonth.length + firstDayIndex)
  ) % daysPerWeek;
  let daysInPreviousMonth = [];
  let daysInNextMonth = [];

  // for display with monday as first day of week
  if (deltaToPrevMonth > 0) {
    daysInPreviousMonth = getDummyArray(firstDayIndex, null);

    if (deltaToNextMonth <= weeksPerMonth) {
      daysInNextMonth = getDummyArray(deltaToNextMonth, null);
    }
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
    val.disabled && className.push('disabled');

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
    const daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * (i + 1));
    const dateNames = assignState(daysInWeek, 'date');

    weeks.unshift(dateNames);
  }

  return weeks;
}


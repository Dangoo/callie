import { getShiftedArray, getDummyArray } from "./helper/array";
import type {
  DateItem,
  ElementData,
  MonthItem,
  StateClassNames,
  YearItem,
} from "./types";

/**
 * Shift index of day according to daysInWeekIndices declaration
 *
 * @param   {number} dayIndex Number Index of day to become shifted
 * @returns          Number Shifted index
 */
function shiftDayIndex<T>(dayIndex: number, shiftRule: T[]): T {
  return shiftRule[dayIndex];
}

/**
 * Fill the margin of days from other months days in first/last week
 *
 * @param   daysInMonth     Array Days of month
 * @param   weeksPerMonth   Number of weeks per month
 * @param   daysPerWeek     Number of days per week
 * @returns                 Array
 */
export function fillMonth(
  daysInMonth: DateItem[],
  weeksPerMonth: number,
  daysPerWeek: number
) {
  const maxDaysInMonth = daysPerWeek * weeksPerMonth;
  const firstDayIndex: number = shiftDayIndex(
    daysInMonth[0].day,
    getShiftedArray(7, 1)
  );
  const deltaToPrevMonth = firstDayIndex;
  const deltaToNextMonth =
    (maxDaysInMonth - (daysInMonth.length + firstDayIndex)) % daysPerWeek;
  let daysInPreviousMonth: null[] = [];
  let daysInNextMonth: null[] = [];

  // for display with monday as first day of week
  if (deltaToPrevMonth > 0) {
    daysInPreviousMonth = getDummyArray(firstDayIndex, null);
  }

  if (deltaToNextMonth > 0) {
    daysInNextMonth = getDummyArray(deltaToNextMonth, null);
  }

  return {
    daysInPreviousMonth: daysInPreviousMonth,
    daysInMonth: daysInMonth,
    daysInNextMonth: daysInNextMonth,
  };
}

export function assignState(
  list: DateItem[],
  childrenKey: "date",
  valueKey: "date",
  stateClassNames: StateClassNames
): ElementData[];

export function assignState(
  list: MonthItem[],
  childrenKey: "monthName",
  valueKey: "month",
  stateClassNames: StateClassNames
): ElementData[];

export function assignState(
  list: YearItem[],
  childrenKey: "year",
  valueKey: "year",
  stateClassNames: StateClassNames
): ElementData[];

export function assignState(
  list: any[],
  childrenKey: "date" | "monthName" | "year",
  valueKey: "date" | "month" | "year",
  stateClassNames: StateClassNames
): ElementData[] {
  return list.map((val) => {
    if (!val) {
      return {};
    }

    const className = [];
    val.current && className.push(stateClassNames.current);
    val.selected && className.push(stateClassNames.selected);
    val.disabled && className.push(stateClassNames.disabled);

    return convertToAST(val[childrenKey], {
      className,
      data: {
        value: val[valueKey],
        type: valueKey,
      },
    });
  });
}

export function convertToAST<A = {}>(
  children: string,
  attrs?: A
): A & ElementData {
  return Object.assign(
    {
      children,
    },
    attrs
  );
}

function splitMonthInWeeks(
  days: [],
  weeksPerMonth: number,
  daysPerWeek: number,
  stateClassNames: StateClassNames
) {
  const weeks = [];

  for (var i = weeksPerMonth - 1; i >= 0; i--) {
    const daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * (i + 1));
    const dateNames = assignState(daysInWeek, "date", "date", stateClassNames);

    weeks.unshift(dateNames);
  }

  return weeks;
}

export function getWeeksOfMonth(
  month: {
    daysInMonth: DateItem[];
    daysInNextMonth: null[];
    daysInPreviousMonth: null[];
  },
  weeksPerMonth: number,
  daysPerWeek: number,
  useWeeks: boolean,
  stateClassNames: { current: string; selected: string; disabled: string }
) {
  const daysForMonths: (DateItem | null)[][] = [month.daysInMonth];

  if (useWeeks) {
    daysForMonths.unshift(month.daysInPreviousMonth);
    daysForMonths.push(month.daysInNextMonth);
  }

  return splitMonthInWeeks(
    // @ts-ignore
    [].concat.apply([], daysForMonths),
    weeksPerMonth,
    daysPerWeek,
    stateClassNames
  );
}

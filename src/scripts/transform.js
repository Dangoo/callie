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

	// For display with monday as first day of week
	if (deltaToPrevMonth > 0) {
		daysInPreviousMonth = getDummyArray(firstDayIndex, null);
	}

	if (deltaToNextMonth > 0) {
		daysInNextMonth = getDummyArray(deltaToNextMonth, null);
	}

	return {
		daysInPreviousMonth,
		daysInMonth,
		daysInNextMonth
	};
}

export function convertToAST(children, attrs) {
	return Object.assign({
		children
	}, attrs);
}

export function assignState(list, childrenKey, valueKey, stateClassNames) {
	return list.map(val => {
		if (!val) {
			return null;
		}

		const properties = ['current', 'selected', 'disabled'];
		const className = properties.reduce((prev, prop) => {
			if (val[prop]) {
				prev.push(stateClassNames[prop]);
			}

			return prev;
		}, []);

		return convertToAST(
			val[childrenKey],
			{
				className,
				data: {
					value: val[valueKey],
					type: valueKey
				}
			}
		);
	});
}

function splitMonthInWeeks(days, weeksPerMonth, daysPerWeek, stateClassNames) {
	const weeks = [];

	for (let i = weeksPerMonth - 1; i >= 0; i--) {
		const daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * (i + 1));
		const dateNames = assignState(daysInWeek, 'date', 'date', stateClassNames);

		weeks.unshift(dateNames);
	}

	return weeks;
}

export function getWeeksOfMonth(
	month,
	weeksPerMonth,
	daysPerWeek,
	useWeeks,
	stateClassNames
) {
	let daysForMonths = month.daysInMonth;

	if (useWeeks) {
		daysForMonths = [
			...month.daysInPreviousMonth,
			...daysForMonths,
			...month.daysInNextMonth
		];
	}

	return splitMonthInWeeks(
		daysForMonths,
		weeksPerMonth,
		daysPerWeek,
		stateClassNames
	);
}

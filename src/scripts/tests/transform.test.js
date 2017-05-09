import {
	fillMonth,
	getWeeksOfMonth
} from '../transform';
import {
	getDatesInMonth
} from '../date';

const datesInMonthsMock = getDatesInMonth(new Date(2017, 1, 1));
const weeksPerMonth = 6;
const daysPerWeek = 7;

/**
 * Test for fillMonth
 */
test('Returns days with padding', () => {
	expect(fillMonth(datesInMonthsMock, weeksPerMonth, daysPerWeek)).toMatchSnapshot();
});

/**
 * Test for getWeeksOfMonth
 */
test('Return month splitted in weeks', () => {
	const monthMock = fillMonth(datesInMonthsMock, weeksPerMonth, daysPerWeek);
	expect(getWeeksOfMonth(monthMock, weeksPerMonth, daysPerWeek, true, {})).toMatchSnapshot();
});

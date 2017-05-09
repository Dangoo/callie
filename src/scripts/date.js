/**
 * Validate a given date
 *
 * @param   {Date} date Date to be validated
 * @return  {Date}
 */
function validateDate(date) {
	// Simple test if date is valid
	if (date.toString() !== 'Invalid Date') {
		return date;
	}

	return null;
}

/**
 * Parses a date according to a given scheme
 *
 * @param  {String} dateString Datestring to be parseDate
 * @param  {String} format     Date format string e.g. 'dd.mm.yyyy'
 *
 * @return {Date}
 */
export function parseDate(dateString, format) {
	let parts = [];

	switch (format) {
		// 'de'
		case 'DD.MM.YYYY':
			parts = dateString.split('.').reverse();
			break;
		// ''
		case 'MM.DD.YYYY':
			parts = dateString.split('.');
			parts.unshift(parts.pop());
			break;
		// 'en'
		case 'MM/DD/YYYY':
			parts = dateString.split('/');
			parts.unshift(parts.pop());
			break;
		// 'en-GB'
		case 'DD/MM/YYYY':
			parts = dateString.split('/').reverse();
			break;
		default:
			parts = dateString.split('-');
			break;
	}

	return validateDate(
		new Date(parts.join('-'))
	);
}

/**
 * @param  {Date}   date
 * @param  {String} template
 *
 * @return {String}
 */
function formatDateFallback(date, template) {
	function fillAndReplace(datePartial, match) {
		return ('0000' + datePartial).slice(-match.length);
	}

	return template
		// Replace <'D' | 'DD'>
		.replace(/(D{1,2})/, match => fillAndReplace(
			date.getDate(), match
		))
		// Replace <'M' | 'MM'>
		.replace(/(M{1,2})/, match => fillAndReplace(
			date.getMonth() + 1, match
		))
		// Replace <'Y' | 'YY' | 'YYY' | 'YYYY'>
		.replace(/(Y{1,4})/, match => fillAndReplace(
			date.getFullYear(), match
		));
}

/**
 * Format date according to given locale, fallback ISO timestring
 *
 * @param   {Date}   date             Date to be formatted
 * @param   {String} locale           Locale to convert date according to
 * @param   {String} fallbackTemplate Template using placeholder (dd | mm | yyyy) and separators (. | / | -)
 *
 * @return  {String}
 */
export function formatDate(date, locale = navigator.language, fallbackTemplate) {
	if (typeof Intl === 'undefined') {
		const dateString = date.toLocaleString(locale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});

		// Due to IE11 LTR marks included
		if (dateString.indexOf('\u200E') !== -1) {
			return dateString.replace(/[\u200E]/g, '');
		}

		return dateString;
	}

	// Fallback for iOS 9
	return formatDateFallback(date, fallbackTemplate);
}

/**
 * Compare two dates
 *
 * @param  {Date} date1 First date to compare to second one
 * @param  {Date} date2 Second date to compare to first one
 *
 * @return {Boolean}    Date is equal or not
 */
function compareDates(date1, date2) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

/**
 * Compare two dates
 *
 * @param  {Date}    date      First date to compare
 * @param  {Date}    [minDate] Minimal date
 * @param  {Date}    [maxDate] Maximum date
 *
 * @return {Boolean}           Date is in Range
 */
export function dateInRange(date, minDate, maxDate) {
	if (!minDate && !maxDate) {
		return true;
	}

	const dateMs = date.getTime();
	return dateMs >= minDate.getTime() && dateMs <= maxDate.getTime();
}

/**
 * GetDaysPerMonth
 *
 * @param   {Date}   date Date of wich month to calculate amount of days of
 * @return  {Number}      Amount of days of passed month
 */
export function getDaysPerMonth(date) {
	const tempDate = new Date(date);
	// Increment month by 1 to switch to next month
	tempDate.setDate(1);
	tempDate.setMonth(tempDate.getMonth() + 1);
	// Set date to 0 to get last day of previous month
	tempDate.setDate(0);

	return tempDate.getDate();
}

/**
 * GetDatesInMonth
 *
 * @param  {Date}   date          Date of wich month to calculate days of
 * @param  {Number} [selectedDay] Integer of selected day
 * @param  {Date}   [minDate]     Minimal allowed date
 * @param  {Date}   [maxDate]     Maximal allowed date
 *
 * @return {Object}               List of dates in current month
 */
export function getDatesInMonth(date, selectedDay, minDate, maxDate) {
	const tempDate = new Date(date);
	const daysPerMonth = getDaysPerMonth(date);
	const datesInMonth = [];

	for (let i = daysPerMonth; i > 0; i--) {
		const actualDate = new Date(tempDate.setDate(i));

		datesInMonth.unshift({
			fullDate: actualDate,
			date: tempDate.getDate(),
			day: tempDate.getDay(),
			current: compareDates(actualDate, new Date()),
			selected: tempDate.getDate() === selectedDay,
			disabled: !dateInRange(tempDate, minDate, maxDate)
		});
	}

	return datesInMonth;
}

/**
 * GetMonthsInYear
 *
 * @param  {Array}  months          List of months
 * @param  {Number} selectedMonth   Integer of selected month
 * @param  {Date}   [minDate]       Minimal allowed date
 * @param  {Date}   [maxDate]       Maximal allowed date
 *
 * @return {Object}               List of months in year
 */
export function getMonthsInYear(months, selectedDate, minDate, maxDate) {
	const minDateMonth = minDate ? new Date(minDate.getFullYear(), minDate.getMonth()) : undefined;

	return months.map((item, index) => {
		return {
			month: index,
			monthName: item,
			selected: index === selectedDate.getMonth(),
			current: index === new Date().getMonth(),
			disabled: !dateInRange(
				new Date(selectedDate.getFullYear(), index),
				minDateMonth,
				maxDate)
		};
	});
}

/**
 * GetYears
 *
 * @param  {Number} yearFrom     Year to count from
 * @param  {Number} yearTo       Year to count to
 * @param  {Number} selectedYear Integer of selected year
 *
 * @return {Object}              List of months in year
 */
export function getYears(yearFrom, yearTo, selectedYear) {
	const delta = Math.abs(yearTo - yearFrom);
	const years = [];

	for (let i = delta; i >= 0; i--) {
		const year = yearFrom + i;
		years.push({
			year,
			selected: year === selectedYear,
			current: year === new Date().getFullYear()
		});
	}

	return years;
}

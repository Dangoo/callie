/**
 * Validate a given date
 *
 * @param   date Date Date to be validated
 * @returns      Date
 */
function validateDate(date) {
  // Simple test if date is valid
  if (date != 'Invalid Date') {
    return date;
  } else {
    return null;
  }
}

/**
 * Parses a date according to a given scheme
 *
 * @param   dateString String Datestring to be parseDate
 * @param   format     String Date format string e.g. 'dd.mm.yyyy'
 *
 * @returns            Date
 */
export function parseDate(dateString, format) {
  let parts = [];
  switch (format) {
    case 'dd.mm.yyyy':
      parts = dateString.split('.').reverse();
      break;
    case 'dd/mm/yyyy':
      parts = dateString.split('/').reverse();
      break;
    case 'mm.dd.yyyy':
      parts = dateString.split('.');
      parts.unshift(parts.pop());
      break;
    default:
      parts = dateString.split('-')
      break;
  }

  return validateDate(
    new Date(parts.join('-'))
  );
}

/**
 * Format date according to given locale, fallback ISO timestring
 *
 * @param   date   Date   Date to be formatted
 * @param   locale String Locale to convert date according to
 *
 * @returns        Date
 */
export function formatDate(date, locale = navigator.language) {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Compare two dates
 *
 * @param   date1 Date    First date to compare to second one
 * @param   date2 Date    Second date to compare to first one
 *
 * @returns       Boolean Date is equal or not
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
 * @param   date    Date    First date to compare
 * @param   minDate Date    Minimal date
 * @param   maxDate Date    Maximum date
 *
 * @returns         Boolean Date is in Range
 */
export function dateInRange(date, minDate, maxDate) {
  const dateMs = date.getTime();
  return dateMs >= minDate.getTime() && dateMs <= maxDate.getTime();
}

/**
 * Converts time interval from ms to years, months and days
 */

/**
 * getDaysPerMonth
 *
 * @param   date Date   Date of wich month to calculate amount of days of
 * @returns      Number Amount of days of passed month
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
 * getDatesInMonth
 *
 * @param   date        Date   Date of wich month to calculate days of
 * @param   selectedDay Number Integer of selected day
 * @param   minDate     Date   Minimal allowed date
 * @param   maxDate     Date   Maximal allowed date
 *
 * @returns             Object List of dates in current month
 */
export function getDatesInMonth(date, selectedDay, minDate, maxDate) {
  let tempDate = new Date(date);
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
 * getMonthsInYear
 *
 * @param   months        Array  List of months
 * @param   selectedMonth Number Integer of selected month
 * @param   minDate       Date   Minimal allowed date
 * @param   maxDate       Date   Maximal allowed date
 *
 * @returns               Object List of months in year
 */
export function getMonthsInYear(months, selectedDate, minDate, maxDate) {
  return months.map((item, index) => {
    return {
      month: index,
      monthName: item,
      selected: index === selectedDate.getMonth(),
      current: index === new Date().getMonth(),
      disabled: !dateInRange(new Date(selectedDate.getFullYear(), index), minDate, maxDate)
    };
  });
}

/**
 * getYears
 *
 * @param   yearFrom      Number Year to count from
 * @param   yearTo        Number Year to count to
 * @param   selectedYear  Number Integer of selected year
 *
 * @returns               Object List of months in year
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

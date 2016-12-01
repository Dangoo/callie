/**
 * Compare date to current (local) date
 *
 * @param   date Date    Date to compare to current date
 * @returns      Boolean Date is today or not
 */
function compareDates(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

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
 *
 * @returns             Object List of dates in current month
 */
export function getDatesInMonth(date, selectedDay) {
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
      selected: tempDate.getDate() === selectedDay
    });
  }

  return datesInMonth;
}

/**
 * getMonthsInYear
 *
 * @param   months        Array  List of months
 * @param   selectedMonth Number Integer of selected month
 *
 * @returns               Object List of months in year
 */
export function getMonthsInYear(months, selectedMonth) {
  return months.map((item, index) => {
    return {
      month: item,
      selected: index === selectedMonth
    };
  });
}

function getYears(forwards, date, count, selectedYear) {
  const startDate = new Date(date).getFullYear();
  const years = [];

  if(forwards) {
    for (let i = count - 1; i >= 0; i--) {
      const year = startDate + i;
      years.push({
        year,
        selected: year === selectedYear
      });
    }
  } else {
    for (let i = count - 1; i >= 0; i--) {
      const year = startDate - i;
      years.push({
        year,
        selected: year === selectedYear
      });
    }
  }

  return years.reverse();
}

export function getYearsFrom(date, count, selectedYear) {
  return getYears(true, date, count, selectedYear);
}

export function getYearsTo(date, count, selectedYear) {
  return getYears(false, date, count, selectedYear);
}

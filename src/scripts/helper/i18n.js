export function getDateNames(locale = navigator.language) {
  const monthNames = [];
  const dayNames = [];
  // Set date to Thu Jan 01 1970 01:00:00 GMT+0100 (CET)
  const date = new Date(0);

  for (let i = 11; i >= 0; i--) {
    date.setMonth(i);

    monthNames.push(
      date.toLocaleString(locale, { month: 'long' })
    );
  }

  for (let i = 6; i >= 0; i--) {
    // Date to Mon Jan 05 1970 01:00:00 GMT+0100 (CET) to get first day of week
    date.setDate(5 + i);
    dayNames.push(
      date.toLocaleString(locale, { weekday: 'short' })
    );
  }

  return {
    days: dayNames.reverse(),
    months: monthNames.reverse()
  };
}

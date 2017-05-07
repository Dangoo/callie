import {
  parseDate,
  formatDate,
  dateInRange,
  getDaysPerMonth
} from '../scripts/date';

var expectedDate = new Date('2017-02-01');

/**
 * parseDate
 */
test('Parse date in format DD.MM.YYYY', () => {
  expect(parseDate('01.02.2017', 'DD.MM.YYYY')).toEqual(expectedDate);
});

test('Parse date in format DD/MM/YYYY', () => {
  expect(parseDate('01/02/2017', 'DD/MM/YYYY')).toEqual(expectedDate);
});

test('Parse date in format MM/DD/YYYY', () => {
  expect(parseDate('02/01/2017', 'MM/DD/YYYY')).toEqual(expectedDate);
});

test('Parse date in format MM.DD.YYYY', () => {
  expect(parseDate('02.01.2017', 'MM.DD.YYYY')).toEqual(expectedDate);
});

/**
 * formatDate
 */
test('Format date in locale "de" / format "DD.MM.YYYY"', () => {
  expect(formatDate(expectedDate, 'de', 'DD.MM.YYYY')).toBe('01.02.2017');
});

test('Format date in locale "en" / format "MM/DD/YYYY"', () => {
  expect(formatDate(expectedDate, 'en', 'MM/DD/YYYY')).toBe('02/01/2017');
});

test('Format date in locale "en-GB" / format "DD/MM/YYYY"', () => {
  expect(formatDate(expectedDate, 'en-GB', 'DD/MM/YYYY')).toBe('01/02/2017');
});

/**
 * dateInRange
 */
test('2017-02-01 in range of 2017-01-01 to 2017-02.02', () => {
  expect(
    dateInRange(
      expectedDate,
      new Date('2017-01-01'),
      new Date('2017-02-02')
    )
  ).toBeTruthy();
});

test('2017-02-01 in range of 2017-01-02 to 2017-02.03', () => {
  expect(
    dateInRange(
      expectedDate,
      new Date('2017-02-02'),
      new Date('2017-02-03')
    )
  ).toBeFalsy();
});

/**
 * getDaysPerMonth
 */
test('February 2017 has 28 days', () => {
  expect(getDaysPerMonth(expectedDate)).toBe(28);
});

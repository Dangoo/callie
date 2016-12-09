import { getDateNames } from './helper/i18n';
import {
  parseDate,
  dateInRange,
  getDaysPerMonth,
  getDatesInMonth,
  getMonthsInYear,
  getYears
} from './date';
import {
  fillMonth,
  splitMonthInWeeks,
  convertToAST,
  assignState
} from './transform';
import {
  buildTable,
  buildList,
  renderInNode
} from './helper/dom';

export default function datepicker(element, options) {

  const defaultOpts = {
    weeksPerMonth: 6,
    daysPerWeek: 7,
    useWeeks: true,
    containerSelector: '[data-role=container]',
    daysTargetSelector: '[data-role=days]',
    monthsTargetSelector: '[data-role=months]',
    yearsTargetSelector: '[data-role=years]',
    format: 'dd.mm.yyyy',
    dateNamesFallback: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      months: ['January', 'February','March', 'April', 'Mai', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  };

  const inputNode = element.querySelector('[data-role=input]');
  const dateNow = new Date();
  const localOpts = {
    _value: inputNode.value,
    _maxDate: inputNode.max ? new Date(inputNode.max) : dateNow,
    _minDate: inputNode.min ? new Date(inputNode.min) : new Date(0),
    _selectedDate: inputNode.value ? parseDate(inputNode.value) : undefined
  }

  const opts = Object.assign(
    defaultOpts,
    options,
    localOpts
  );

  const dateNames = getDateNames(undefined, opts.dateNamesFallback);
  let containerNode;
  let daysViewNode;
  let monthsViewNode;
  let yearsViewNode;

  function updatePicker(date) {
    const datesInMonth = getDatesInMonth(
      date,
      opts._selectedDate.getDate(),
      opts._minDate,
      opts._maxDate
    );
    const month = fillMonth(datesInMonth, opts.weeksPerMonth, opts.daysPerWeek);
    let weeksOfMonth = [];
    let dateNamesAST = null;

    if (opts.useWeeks) {
      weeksOfMonth = splitMonthInWeeks(
        [].concat(
          month.daysInPreviousMonth,
          month.daysInMonth,
          month.daysInNextMonth
        ),
        opts.weeksPerMonth,
        opts.daysPerWeek
      );
      dateNamesAST = dateNames.days.map((item) => convertToAST(item));
    } else {
      weeksOfMonth = splitMonthInWeeks(
        month.daysInMonth,
        opts.weeksPerMonth,
        opts.daysPerWeek
      );
    }

    const daysTable = buildTable(dateNamesAST, weeksOfMonth);
    const monthsAST = assignState(
      getMonthsInYear(dateNames.months, opts._selectedDate.getMonth()),
      'month'
    );
    const monthsList = buildList('ol', monthsAST, 'month');
    const yearsAST = assignState(
      getYears(
        opts._minDate.getFullYear(),
        opts._maxDate.getFullYear(),
        opts._selectedDate.getFullYear()
      ),
      'year'
    );
    const yearsList = buildList('ol', yearsAST, 'years');

    renderInNode(daysViewNode, daysTable);
    renderInNode(monthsViewNode, monthsList);
    renderInNode(yearsViewNode, yearsList);
  }

  function handleChange(e) {
    const date = parseDate(e.target.value, opts.format);

    if (
      date &&
      dateInRange(date,  opts._minDate, opts._maxDate)
    ) {
      opts._selectedDate = date;

      updatePicker(date);
    }
  }

  function init() {
    element.addEventListener('change', handleChange);

    containerNode = element.querySelector(opts.containerSelector);
    daysViewNode = containerNode.querySelector(opts.daysTargetSelector);
    monthsViewNode = containerNode.querySelector(opts.monthsTargetSelector);
    yearsViewNode = containerNode.querySelector(opts.yearsTargetSelector);

    if (opts._selectedDate) {
      updatePicker(opts._selectedDate);
    }
  }

  init();
}

const input = document.querySelector('.date-input');
datepicker(input);

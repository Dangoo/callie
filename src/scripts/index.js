import { getDateNames } from './helper/i18n';
import {
  parseDate,
  getDaysPerMonth,
  getDatesInMonth,
  getMonthsInYear,
  getYearsFrom,
  getYearsTo
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
    format: 'dd.mm.yyyy'
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

  console.log(opts);

  const dateNames = getDateNames();
  let containerNode;
  let daysViewNode;
  let monthsViewNode;
  let yearsViewNode;

  function updatePicker(date) {
    const datesInMonth = getDatesInMonth(date, opts._selectedDate.getDate());
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
      getYearsTo(opts._maxDate, 100, opts._selectedDate.getFullYear()),
      'year'
    );
    const yearsList = buildList('ol', yearsAST, 'years');

    renderInNode(daysViewNode, daysTable);
    renderInNode(monthsViewNode, monthsList);
    renderInNode(yearsViewNode, yearsList);
  }

  function handleChange(e) {
    const date = parseDate(e.target.value, opts.format);

    if (!date) {
      return;
    }

    opts._selectedDate = date;

    updatePicker(date);
  }

  function init() {
    element.addEventListener('change', handleChange);

    // First init
    // element.value = new Date().toISOString().slice(0, 10);

    containerNode = element.querySelector(opts.containerSelector);
    daysViewNode = containerNode.querySelector(opts.daysTargetSelector);
    monthsViewNode = containerNode.querySelector(opts.monthsTargetSelector);
    yearsViewNode = containerNode.querySelector(opts.yearsTargetSelector);

    updatePicker(new Date());
  }

  init();
}

const input = document.querySelector('.date-input');
datepicker(input);

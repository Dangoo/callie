import { getDateNames } from './helper/i18n';
import {
  getDaysPerMonth,
  getDatesInMonth,
  getMonthsInYear,
  getYearsFrom,
  getYearsTo
} from './date';
import {
  formatValue,
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
  let inputNode = element.querySelector('[data-role=input]');

  const opts = Object.assign(
    {
      weeksPerMonth: 6,
      daysPerWeek: 7,
      useWeeks: true,
      containerSelector: '[data-role=container]',
      daysTargetSelector: '[data-role=days]',
      monthsTargetSelector: '[data-role=months]',
      yearsTargetSelector: '[data-role=years]',
      maxDate: inputNode.max && new Date(inputNode.max),
      minDate: inputNode.min && new Date(inputNode.min)
    },
    options
  );

  console.log(opts);

  let selectedDate = {
    day: 12,
    month: 5,
    year: 2016
  };

  const dateNames = getDateNames();
  let containerNode;
  let daysViewNode;
  let monthsViewNode;
  let yearsViewNode;

  function updatePicker(date) {
    const datesInMonth = getDatesInMonth(date, selectedDate.day);
    const month = fillMonth(datesInMonth, opts.weeksPerMonth, opts.daysPerWeek);
    let daysTable;

    if (opts.useWeeks) {
      const weeksOfMonth = splitMonthInWeeks(
        [].concat(
          month.daysInPreviousMonth,
          month.daysInMonth,
          month.daysInNextMonth
        ),
        opts.weeksPerMonth,
        opts.daysPerWeek
      );
      const dateNamesAST = dateNames.days.map((item) => convertToAST(item));

      daysTable = buildTable(dateNamesAST, weeksOfMonth);
    } else {
      const weeksOfMonth = splitMonthInWeeks(
        month.daysInMonth,
        opts.weeksPerMonth,
        opts.daysPerWeek
      );

      daysTable = buildTable(null, weeksOfMonth);
    }

    const monthsAST = assignState(
      getMonthsInYear(dateNames.months, selectedDate.month),
      'month'
    );
    const monthsList = buildList('ol', monthsAST, 'month');

    const yearsAST = assignState(
      getYearsTo(opts.maxDate, 100, selectedDate.year),
      'year'
    );
    const yearsList = buildList('ol', yearsAST, 'years');

    renderInNode(daysViewNode, daysTable);
    renderInNode(monthsViewNode, monthsList);
    renderInNode(yearsViewNode, yearsList);
  }

  function handleChange(e) {
    const value = e.target.value;
    const date = new Date(
      formatValue(value, 'dd.mm.yyyy')
    );

    // Simple test if date is valid
    if (date == 'Invalid Date') {
      return;
    }

    selectedDate = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    };

    updatePicker(date);
  }

  function init() {
    element.addEventListener('change', handleChange);

    // First init
    element.value = new Date().toISOString().slice(0, 10);

    containerNode = element.querySelector(opts.containerSelector);
    daysViewNode = containerNode.querySelector(opts.daysTargetSelector);
    monthsViewNode = element.querySelector(opts.monthsTargetSelector);
    yearsViewNode = containerNode.querySelector(opts.yearsTargetSelector);

    updatePicker(new Date());
  }

  init();
}

const input = document.querySelector('.date-input');
datepicker(input);

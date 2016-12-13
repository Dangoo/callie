import { getDateNames } from './helper/i18n';
import {
  parseDate,
  formatDate,
  dateInRange,
  getDatesInMonth,
  getMonthsInYear,
  getYears
} from './date';
import {
  fillMonth,
  getWeeksOfMonth,
  convertToAST,
  assignState
} from './transform';
import {
  buildTable,
  buildList,
  renderInNode
} from './helper/dom';

export default function datepicker(element, options) {
  let _inputNode;
  let _containerNode;
  let _daysViewNode;
  let _monthsViewNode;
  let _yearsViewNode;
  let _opts;
  let _localOpts;
  let _dateNames;
  let _dayNamesAST;

  const defaultOpts = {
    weeksPerMonth: 6,
    daysPerWeek: 7,
    containerSelector: '[data-role=container]',
    daysTargetSelector: '[data-role=days]',
    monthsTargetSelector: '[data-role=months]',
    yearsTargetSelector: '[data-role=years]',
    inputTargetSelector: '[data-role=input]',
    format: 'dd.mm.yyyy',
    dateNamesFallback: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      months: ['January', 'February', 'March', 'April', 'Mai', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  };


  function updatePicker(date) {
    const datesInMonth = getDatesInMonth(
      date,
      _localOpts.selectedDate.getDate(),
      _localOpts.minDate,
      _localOpts.maxDate
    );

    const month = fillMonth(
      datesInMonth,
      _opts.weeksPerMonth,
      _opts.daysPerWeek
    );

    const daysTable = buildTable(
      _localOpts.useWeeks ? _dayNamesAST : null,
      getWeeksOfMonth(
        month,
        _opts.weeksPerMonth,
        _opts.daysPerWeek,
        _localOpts.useWeeks
      )
    );

    const monthsAST = assignState(
      getMonthsInYear(
        _dateNames.months,
        _localOpts.selectedDate,
        _localOpts.minDate,
        _localOpts.maxDate
      ),
      'monthName',
      'month'
    );

    const monthsList = buildList('ol', monthsAST, 'month');

    const yearsAST = assignState(
      getYears(
        _localOpts.minDate.getFullYear(),
        _localOpts.maxDate.getFullYear(),
        _localOpts.selectedDate.getFullYear()
      ),
      'year',
      'year'
    );

    const yearsList = buildList('ol', yearsAST, 'years');

    renderInNode(_daysViewNode, daysTable);
    renderInNode(_monthsViewNode, monthsList);
    renderInNode(_yearsViewNode, yearsList);
  }

  function updateInput(date) {
    if (_inputNode.type === 'date') {
      _inputNode.value = date.toISOString().slice(0, 10);
    } else if (_inputNode.type === 'text') {
      _inputNode.value = formatDate(date);
    }
  }

  function handleChange(e) {
    const date = parseDate(e.target.value, _opts.format);

    if (
      date &&
      dateInRange(date, _localOpts.minDate, _localOpts.maxDate)
    ) {
      _localOpts.selectedDate = date;

      updatePicker(date);
    }
  }

  function handleSelect(e) {
    const value = e.target.dataset.value;
    const type = e.target.dataset.type;
    const tempDate = new Date(_localOpts.selectedDate);

    if (!(value || type)) {
      return;
    }

    switch (type) {
      case 'date':
        tempDate.setDate(value)
        break;
      case 'month':
        tempDate.setMonth(value)
        break;
      case 'year':
        tempDate.setFullYear(value)
        break;
    }

    const inRange = dateInRange(
      tempDate,
      _localOpts.minDate,
      _localOpts.maxDate
    );

    if (inRange) {
      _localOpts.selectedDate = tempDate;

      updateInput(tempDate);
      updatePicker(tempDate);
    }
  }

  function init() {
    _opts = Object.assign(
      defaultOpts,
      options
    );

    const dateNow = new Date();

    _containerNode = element.querySelector(_opts.containerSelector);
    _inputNode = element.querySelector(_opts.inputTargetSelector);
    _daysViewNode = _containerNode.querySelector(_opts.daysTargetSelector);
    _monthsViewNode = _containerNode.querySelector(_opts.monthsTargetSelector);
    _yearsViewNode = _containerNode.querySelector(_opts.yearsTargetSelector);

    element.addEventListener('input', handleChange);
    _containerNode.addEventListener('click', handleSelect);

    _localOpts = {
      value: _inputNode.value,
      maxDate: _inputNode.max ? new Date(_inputNode.max) : dateNow,
      minDate: _inputNode.min ? new Date(_inputNode.min) : new Date(0),
      selectedDate: _inputNode.value ?
        parseDate(_inputNode.value, _opts.format) :
        undefined,
      useWeeks: true
    };

    _dateNames = getDateNames(undefined, _opts.dateNamesFallback);
    _dayNamesAST = _dateNames.days.map((item) => convertToAST(item));

    if (_localOpts.selectedDate) {
      updatePicker(_localOpts.selectedDate);
    }
  }

  init();
}

datepicker(document.querySelector('.date-input'));

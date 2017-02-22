import * as lib from './library';

export default function callie(element, options) {
  let _inputNode;
  let _containerStateNode;
  let _containerNode;
  let _daysViewNode;
  let _monthsViewNode;
  let _yearsViewNode;
  let _opts;
  let _localOpts;
  let _dateNames;
  let _dayNamesAST;
  let _stateClassNames;

  const defaultOpts = {
    weeksPerMonth: 6,
    daysPerWeek: 7,
    containerStateSelector: '[data-role=ui-state]',
    containerSelector: '[data-role=container]',
    daysTargetSelector: '[data-role=days]',
    monthsTargetSelector: '[data-role=months]',
    yearsTargetSelector: '[data-role=years]',
    inputTargetSelector: '[data-role=input]',
    selectedStateClassName: 'date-input__item--selected',
    currentStateClassName: 'date-input__item--current',
    disabledStateClassName: 'date-input__item--disabled',
    format: 'dd.mm.yyyy',
    noTouch: false,
    isOpen: false,
    dateNamesFallback: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      months: ['January', 'February', 'March', 'April', 'Mai', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  };

  function updatePicker(date) {
    const datesInMonth = lib.getDatesInMonth(
      date,
      _localOpts.selectedDate.getDate(),
      _localOpts.minDate,
      _localOpts.maxDate
    );

    const month = lib.fillMonth(
      datesInMonth,
      _opts.weeksPerMonth,
      _opts.daysPerWeek
    );

    const daysTable = lib.buildTable(
      _localOpts.useWeeks ? _dayNamesAST : null,
      lib.getWeeksOfMonth(
        month,
        _opts.weeksPerMonth,
        _opts.daysPerWeek,
        _localOpts.useWeeks,
        _stateClassNames
      )
    );

    const monthsAST = lib.assignState(
      lib.getMonthsInYear(
        _dateNames.months,
        _localOpts.selectedDate,
        _localOpts.minDate,
        _localOpts.maxDate
      ),
      'monthName',
      'month',
      _stateClassNames
    );

    const monthsList = lib.buildList('ol', monthsAST, 'month');

    const yearsAST = lib.assignState(
      lib.getYears(
        _localOpts.minDate.getFullYear(),
        _localOpts.maxDate.getFullYear(),
        _localOpts.selectedDate.getFullYear()
      ),
      'year',
      'year',
      _stateClassNames
    );

    const yearsList = lib.buildList('ol', yearsAST, 'years');

    lib.renderInNode(_daysViewNode, daysTable);
    lib.renderInNode(_monthsViewNode, monthsList);
    lib.renderInNode(_yearsViewNode, yearsList);
  }

  function updateInput(date) {
    if (_inputNode.type === 'date') {
      _inputNode.value = date.toISOString().slice(0, 10);
    } else if (_inputNode.type === 'text') {
      _inputNode.value = lib.formatDate(date);
    }
  }

  function handleChange(e) {
    const date = lib.parseDate(e.target.value, _opts.format);

    if (
      date &&
      lib.dateInRange(date, _localOpts.minDate, _localOpts.maxDate)
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

    const inRange = lib.dateInRange(
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

  function handlePickerToggle(event) {
    if (event.type === 'focus') {
      _localOpts.isOpen = true;
    }

    if (event.type === 'blur' && !_localOpts.localClick) {
      _localOpts.isOpen = false;
    }

    toggleStateNode(_localOpts.isOpen);
  }

  function handleLocalClick(event) {
    _localOpts.localClick = event.type === 'mousedown';
  }

  /**
   * Set type of input to text to solve inconsistencies between
   * Chrome (with date format support) and other browsers
   *
   * @param forceText Boolean
   */
  function toggleType(forceText) {
    const type = (_localOpts.noTouch || forceText) ?
      'text' : 'date';

    _inputNode.type = type;

    updateInput(_localOpts.selectedDate);
  }

  function toggleStateNode(active) {
    _containerStateNode.checked = active || !_containerStateNode.checked;
  }

  function init() {
    _opts = Object.assign(
      defaultOpts,
      options
    );

    const dateNow = new Date();

    _containerStateNode = element.querySelector(_opts.containerStateSelector);
    _containerNode = element.querySelector(_opts.containerSelector);
    _inputNode = element.querySelector(_opts.inputTargetSelector);
    _daysViewNode = _containerNode.querySelector(_opts.daysTargetSelector);
    _monthsViewNode = _containerNode.querySelector(_opts.monthsTargetSelector);
    _yearsViewNode = _containerNode.querySelector(_opts.yearsTargetSelector);

    _localOpts = {
      value: _inputNode.value,
      maxDate: _inputNode.max ? new Date(_inputNode.max) : dateNow,
      minDate: _inputNode.min ? new Date(_inputNode.min) : new Date(0),
      selectedDate: _inputNode.value ?
        lib.parseDate(_inputNode.value, _opts.format) :
        undefined,
      useWeeks: true,
      noTouch: _opts.noTouch || !lib.isTouch(),
      isOpen: _opts.isOpen,
      localClick: false
    };


    // Use datepicker only on non-touchscreens
    if (_localOpts.noTouch) {
      _stateClassNames = {
        current: _opts.currentStateClassName,
        selected: _opts.selectedStateClassName,
        disabled: _opts.disabledStateClassName
      };

      element.addEventListener('input', handleChange);
      _containerNode.addEventListener('click', handleSelect);
      _containerNode.addEventListener('mousedown', handleLocalClick);
      _containerNode.addEventListener('mouseup', handleLocalClick);

      toggleType();

      _dateNames = lib.getDateNames(undefined, _opts.dateNamesFallback);
      _dayNamesAST = _dateNames.days.map((item) => lib.convertToAST(item));

      if (_localOpts.selectedDate) {
        updatePicker(_localOpts.selectedDate);
      }

      _inputNode.addEventListener('focus', handlePickerToggle);
      _inputNode.addEventListener('blur', handlePickerToggle);
    }
  }

  init();
}

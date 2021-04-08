import * as lib from "./library";
import type {
  ElementData,
  InitOptions,
  LocalOptions,
  StateClassNames,
} from "./types";

export default function callie(element: HTMLElement, options: InitOptions) {
  let _inputNode: HTMLInputElement | null;
  let _containerStateNode: HTMLInputElement | null;
  let _containerNode: HTMLElement | null;
  let _daysViewNode: Element | null | undefined;
  let _monthsViewNode: Element | null | undefined;
  let _yearsViewNode: Element | null | undefined;
  let _opts: InitOptions;
  let _localOpts: LocalOptions;
  let _dateNames: { days: string[]; months: string[] };
  let _dayNamesAST: ElementData[];
  let _stateClassNames: StateClassNames;

  const defaultOpts = {
    weeksPerMonth: 6,
    daysPerWeek: 7,
    containerStateSelector: "[data-role=ui-state]",
    containerSelector: "[data-role=container]",
    daysTargetSelector: "[data-role=days]",
    monthsTargetSelector: "[data-role=months]",
    yearsTargetSelector: "[data-role=years]",
    inputTargetSelector: "[data-role=input]",
    selectedStateClassName: "date-input__item--selected",
    currentStateClassName: "date-input__item--current",
    disabledStateClassName: "date-input__item--disabled",
    format: "dd.mm.yyyy",
    noTouch: false,
    isOpen: false,
    dateNamesFallback: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "Mai",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  };

  /**
   * @param {Date} date
   */
  function updatePicker(date: Date) {
    const datesInMonth = lib.getDatesInMonth(
      date,
      _localOpts.selectedDate ? _localOpts.selectedDate.getDate() : undefined,
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
      "monthName",
      "month",
      _stateClassNames
    );

    const monthsList = lib.buildList("ol", monthsAST);

    const yearsAST = lib.assignState(
      lib.getYears(
        _localOpts.minDate.getFullYear(),
        _localOpts.maxDate.getFullYear(),
        _localOpts.selectedDate
          ? _localOpts.selectedDate.getFullYear()
          : undefined
      ),
      "year",
      "year",
      _stateClassNames
    );

    const yearsList = lib.buildList("ol", yearsAST);

    if (_daysViewNode && _monthsViewNode && _yearsViewNode) {
      lib.renderInNode(_daysViewNode, daysTable);
      lib.renderInNode(_monthsViewNode, monthsList);
      lib.renderInNode(_yearsViewNode, yearsList);
    }
  }

  /**
   * @param {Date} date
   */
  function updateInput(date: Date | null | undefined) {
    if (!_inputNode) {
      return;
    }

    if (!date) {
      _inputNode.value = "";
      return;
    }

    switch (_inputNode?.type) {
      case "date":
        _inputNode.value = date ? date.toISOString().slice(0, 10) : "";
        break;

      case "text":
      default:
        _inputNode.value = lib.formatDate(date, undefined, _opts.format);
        break;
    }
  }

  /**
   * Set the date of the input and update datepicker
   *
   * @param  {Date}    date - New date to update to
   * @return {boolean}
   */
  function setDate(date: Date) {
    const inRange = lib.dateInRange(
      date,
      _localOpts.minDate,
      _localOpts.maxDate
    );

    if (inRange) {
      _localOpts.selectedDate = date;

      updateInput(date);
      updatePicker(date);
    }

    return inRange;
  }

  /**
   * @param {Object} event
   */
  function handleChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const date = lib.parseDate(event.target.value, _opts.format);

    if (date && lib.dateInRange(date, _localOpts.minDate, _localOpts.maxDate)) {
      _localOpts.selectedDate = date;

      updatePicker(date);
    }
  }

  /**
   * @param {Object} event
   */
  function handleSelect(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const { value = "", type } = event.target.dataset;

    if (!(value && type)) {
      return;
    }

    const numberValue = parseInt(value);

    const tempDate = _localOpts.selectedDate
      ? new Date(_localOpts.selectedDate)
      : new Date();

    switch (type) {
      case "date":
        tempDate.setDate(numberValue);
        break;
      case "month":
        tempDate.setMonth(numberValue);
        break;
      case "year":
        tempDate.setFullYear(numberValue);
        break;
    }

    setDate(tempDate);
  }

  /**
   * @param {Object} event
   */
  function handlePickerToggle(event: { type: string }) {
    if (event.type === "focus") {
      _localOpts.isOpen = true;
    }

    if (event.type === "blur" && !_localOpts.localClick) {
      _localOpts.isOpen = false;
    }

    toggleStateNode(_localOpts.isOpen);
  }

  /**
   * @param {Object} event
   */
  function handleLocalClick(event: { type: string }) {
    _localOpts.localClick = event.type === "mousedown";
  }

  /**
   * Set type of input to text to solve inconsistencies between
   * desktop Chrome, soon Firefox (with date format support) and other browsers
   *
   * @param {boolean} forceText
   */
  function toggleType(forceText?: boolean) {
    const type = _localOpts.noTouch || forceText ? "text" : "date";

    if (_inputNode) {
      _inputNode.type = type;
    }

    updateInput(_localOpts.selectedDate);
  }

  /**
   * @param {boolean} checked
   */
  function toggleStateNode(checked: boolean) {
    if (_containerStateNode) {
      _containerStateNode.checked = checked || !_containerStateNode.checked;
    }
  }

  function init() {
    _opts = Object.assign(defaultOpts, options);

    const dateNow = new Date();

    _containerStateNode = element.querySelector(_opts.containerStateSelector);
    _containerNode = element.querySelector(_opts.containerSelector);
    _inputNode = element.querySelector(_opts.inputTargetSelector);
    _daysViewNode = _containerNode?.querySelector(_opts.daysTargetSelector);
    _monthsViewNode = _containerNode?.querySelector(_opts.monthsTargetSelector);
    _yearsViewNode = _containerNode?.querySelector(_opts.yearsTargetSelector);

    _localOpts = {
      value: _inputNode?.value,
      maxDate: _inputNode?.max ? new Date(_inputNode.max) : dateNow,
      minDate: _inputNode?.min ? new Date(_inputNode.min) : new Date(0),
      selectedDate: _inputNode?.value
        ? lib.parseDate(_inputNode?.value, _opts.format)
        : undefined,
      useWeeks: true,
      noTouch: _opts.noTouch || !lib.isTouch(),
      isOpen: _opts.isOpen,
      localClick: false,
    };

    // Use datepicker only on non-touchscreens
    if (_localOpts.noTouch) {
      _stateClassNames = {
        current: _opts.currentStateClassName,
        selected: _opts.selectedStateClassName,
        disabled: _opts.disabledStateClassName,
      };

      element.addEventListener("input", handleChange);
      _containerNode?.addEventListener("click", handleSelect);
      _containerNode?.addEventListener("mousedown", handleLocalClick);
      _containerNode?.addEventListener("mouseup", handleLocalClick);

      toggleType();

      _dateNames = lib.getDateNames(undefined, _opts.dateNamesFallback);
      _dayNamesAST = _dateNames.days.map((item) => lib.convertToAST(item));

      if (_localOpts.selectedDate) {
        updatePicker(_localOpts.selectedDate);
      }

      _inputNode?.addEventListener("focus", handlePickerToggle);
      _inputNode?.addEventListener("blur", handlePickerToggle);
    }

    // Expose API
    return {
      setDate,
      getDate: () => _localOpts.selectedDate,
    };
  }

  return init();
}

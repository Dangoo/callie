var __paeckchen_cache__ = [];
function __paeckchen_require__(index) {
    if (!(index in __paeckchen_cache__)) {
        __paeckchen_cache__[index] = { module: { exports: {} } };
        modules[index](__paeckchen_cache__[index].module, __paeckchen_cache__[index].module.exports);
    }
    return __paeckchen_cache__[index].module;
}
var modules = [
    function _0(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.default = datepicker;
        var _i18n = __paeckchen_require__(1).exports;
        var _date = __paeckchen_require__(2).exports;
        var _transform = __paeckchen_require__(3).exports;
        var _dom = __paeckchen_require__(4).exports;
        function datepicker(element, options) {
            var _inputNode = void 0;
            var _containerNode = void 0;
            var _daysViewNode = void 0;
            var _monthsViewNode = void 0;
            var _yearsViewNode = void 0;
            var _opts = void 0;
            var _localOpts = void 0;
            var _dateNames = void 0;
            var _dayNamesAST = void 0;
            var _stateClassNames = void 0;
            var defaultOpts = {
                weeksPerMonth: 6,
                daysPerWeek: 7,
                containerSelector: '[data-role=container]',
                daysTargetSelector: '[data-role=days]',
                monthsTargetSelector: '[data-role=months]',
                yearsTargetSelector: '[data-role=years]',
                inputTargetSelector: '[data-role=input]',
                selectedStateClassName: 'date-input__item--selected',
                currentStateClassName: 'date-input__item--current',
                disabledStateClassName: 'date-input__item--disabled',
                format: 'dd.mm.yyyy',
                dateNamesFallback: {
                    days: [
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        'Sun'
                    ],
                    months: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'Mai',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                    ]
                }
            };
            function updatePicker(date) {
                var datesInMonth = (0, _date.getDatesInMonth)(date, _localOpts.selectedDate.getDate(), _localOpts.minDate, _localOpts.maxDate);
                var month = (0, _transform.fillMonth)(datesInMonth, _opts.weeksPerMonth, _opts.daysPerWeek);
                var daysTable = (0, _dom.buildTable)(_localOpts.useWeeks ? _dayNamesAST : null, (0, _transform.getWeeksOfMonth)(month, _opts.weeksPerMonth, _opts.daysPerWeek, _localOpts.useWeeks, _stateClassNames));
                var monthsAST = (0, _transform.assignState)((0, _date.getMonthsInYear)(_dateNames.months, _localOpts.selectedDate, _localOpts.minDate, _localOpts.maxDate), 'monthName', 'month', _stateClassNames);
                var monthsList = (0, _dom.buildList)('ol', monthsAST, 'month');
                var yearsAST = (0, _transform.assignState)((0, _date.getYears)(_localOpts.minDate.getFullYear(), _localOpts.maxDate.getFullYear(), _localOpts.selectedDate.getFullYear()), 'year', 'year', _stateClassNames);
                var yearsList = (0, _dom.buildList)('ol', yearsAST, 'years');
                (0, _dom.renderInNode)(_daysViewNode, daysTable);
                (0, _dom.renderInNode)(_monthsViewNode, monthsList);
                (0, _dom.renderInNode)(_yearsViewNode, yearsList);
            }
            function updateInput(date) {
                if (_inputNode.type === 'date') {
                    _inputNode.value = date.toISOString().slice(0, 10);
                } else if (_inputNode.type === 'text') {
                    _inputNode.value = (0, _date.formatDate)(date);
                }
            }
            function handleChange(e) {
                var date = (0, _date.parseDate)(e.target.value, _opts.format);
                if (date && (0, _date.dateInRange)(date, _localOpts.minDate, _localOpts.maxDate)) {
                    _localOpts.selectedDate = date;
                    updatePicker(date);
                }
            }
            function handleSelect(e) {
                var value = e.target.dataset.value;
                var type = e.target.dataset.type;
                var tempDate = new Date(_localOpts.selectedDate);
                if (!(value || type)) {
                    return;
                }
                switch (type) {
                case 'date':
                    tempDate.setDate(value);
                    break;
                case 'month':
                    tempDate.setMonth(value);
                    break;
                case 'year':
                    tempDate.setFullYear(value);
                    break;
                }
                var inRange = (0, _date.dateInRange)(tempDate, _localOpts.minDate, _localOpts.maxDate);
                if (inRange) {
                    _localOpts.selectedDate = tempDate;
                    updateInput(tempDate);
                    updatePicker(tempDate);
                }
            }
            function init() {
                _opts = Object.assign(defaultOpts, options);
                var dateNow = new Date();
                _containerNode = element.querySelector(_opts.containerSelector);
                _inputNode = element.querySelector(_opts.inputTargetSelector);
                _daysViewNode = _containerNode.querySelector(_opts.daysTargetSelector);
                _monthsViewNode = _containerNode.querySelector(_opts.monthsTargetSelector);
                _yearsViewNode = _containerNode.querySelector(_opts.yearsTargetSelector);
                _stateClassNames = {
                    current: _opts.currentStateClassName,
                    selected: _opts.selectedStateClassName,
                    disabled: _opts.disabledStateClassName
                };
                element.addEventListener('input', handleChange);
                _containerNode.addEventListener('click', handleSelect);
                _localOpts = {
                    value: _inputNode.value,
                    maxDate: _inputNode.max ? new Date(_inputNode.max) : dateNow,
                    minDate: _inputNode.min ? new Date(_inputNode.min) : new Date(0),
                    selectedDate: _inputNode.value ? (0, _date.parseDate)(_inputNode.value, _opts.format) : undefined,
                    useWeeks: true
                };
                _dateNames = (0, _i18n.getDateNames)(undefined, _opts.dateNamesFallback);
                _dayNamesAST = _dateNames.days.map(function (item) {
                    return (0, _transform.convertToAST)(item);
                });
                if (_localOpts.selectedDate) {
                    updatePicker(_localOpts.selectedDate);
                }
            }
            init();
        }
        datepicker(document.querySelector('.date-input'));
    },
    function _1(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
            return typeof obj;
        } : function (obj) {
            return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
        };
        exports.getDateNames = getDateNames;
        function getDateNames() {
            var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.language;
            var fallback = arguments[1];
            if ((typeof Intl === 'undefined' ? 'undefined' : _typeof(Intl)) !== 'object') {
                return fallback;
            }
            var monthNames = [];
            var dayNames = [];
            var date = new Date(0);
            for (var i = 11; i >= 0; i--) {
                date.setMonth(i);
                monthNames.push(date.toLocaleString(locale, { month: 'long' }));
            }
            for (var _i = 6; _i >= 0; _i--) {
                date.setDate(5 + _i);
                dayNames.push(date.toLocaleString(locale, { weekday: 'short' }));
            }
            return {
                days: dayNames.reverse(),
                months: monthNames.reverse()
            };
        }
    },
    function _2(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.parseDate = parseDate;
        exports.formatDate = formatDate;
        exports.dateInRange = dateInRange;
        exports.getDaysPerMonth = getDaysPerMonth;
        exports.getDatesInMonth = getDatesInMonth;
        exports.getMonthsInYear = getMonthsInYear;
        exports.getYears = getYears;
        function validateDate(date) {
            if (date != 'Invalid Date') {
                return date;
            } else {
                return null;
            }
        }
        function parseDate(dateString, format) {
            var parts = [];
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
                parts = dateString.split('-');
                break;
            }
            return validateDate(new Date(parts.join('-')));
        }
        function formatDate(date) {
            var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : navigator.language;
            return date.toLocaleString(locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
        function compareDates(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
        }
        function dateInRange(date, minDate, maxDate) {
            var dateMs = date.getTime();
            return dateMs >= minDate.getTime() && dateMs <= maxDate.getTime();
        }
        function getDaysPerMonth(date) {
            var tempDate = new Date(date);
            tempDate.setDate(1);
            tempDate.setMonth(tempDate.getMonth() + 1);
            tempDate.setDate(0);
            return tempDate.getDate();
        }
        function getDatesInMonth(date, selectedDay, minDate, maxDate) {
            var tempDate = new Date(date);
            var daysPerMonth = getDaysPerMonth(date);
            var datesInMonth = [];
            for (var i = daysPerMonth; i > 0; i--) {
                var actualDate = new Date(tempDate.setDate(i));
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
        function getMonthsInYear(months, selectedDate, minDate, maxDate) {
            return months.map(function (item, index) {
                return {
                    month: index,
                    monthName: item,
                    selected: index === selectedDate.getMonth(),
                    current: index === new Date().getMonth(),
                    disabled: !dateInRange(new Date(selectedDate.getFullYear(), index), minDate, maxDate)
                };
            });
        }
        function getYears(yearFrom, yearTo, selectedYear) {
            var delta = Math.abs(yearTo - yearFrom);
            var years = [];
            for (var i = delta; i >= 0; i--) {
                var year = yearFrom + i;
                years.push({
                    year: year,
                    selected: year === selectedYear,
                    current: year === new Date().getFullYear()
                });
            }
            return years;
        }
    },
    function _3(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.fillMonth = fillMonth;
        exports.assignState = assignState;
        exports.convertToAST = convertToAST;
        exports.getWeeksOfMonth = getWeeksOfMonth;
        var _array = __paeckchen_require__(5).exports;
        function shiftDayIndex(dayIndex, shiftRule) {
            return shiftRule[dayIndex];
        }
        function fillMonth(daysInMonth, weeksPerMonth, daysPerWeek) {
            var maxDaysInMonth = daysPerWeek * weeksPerMonth;
            var firstDayIndex = shiftDayIndex(daysInMonth[0].day, (0, _array.getShiftedArray)(7, 1));
            var deltaToPrevMonth = firstDayIndex;
            var deltaToNextMonth = (maxDaysInMonth - (daysInMonth.length + firstDayIndex)) % daysPerWeek;
            var daysInPreviousMonth = [];
            var daysInNextMonth = [];
            if (deltaToPrevMonth > 0) {
                daysInPreviousMonth = (0, _array.getDummyArray)(firstDayIndex, null);
            }
            if (deltaToNextMonth > 0) {
                daysInNextMonth = (0, _array.getDummyArray)(deltaToNextMonth, null);
            }
            return {
                daysInPreviousMonth: daysInPreviousMonth,
                daysInMonth: daysInMonth,
                daysInNextMonth: daysInNextMonth
            };
        }
        function assignState(list, childrenKey, valueKey, stateClassNames) {
            return list.map(function (val) {
                if (!val) {
                    return;
                }
                var className = [];
                val.current && className.push(stateClassNames.current);
                val.selected && className.push(stateClassNames.selected);
                val.disabled && className.push(stateClassNames.disabled);
                return convertToAST(val[childrenKey], {
                    className: className,
                    data: {
                        value: val[valueKey],
                        type: valueKey
                    }
                });
            });
        }
        function convertToAST(children, attrs) {
            return Object.assign({ children: children }, attrs);
        }
        function splitMonthInWeeks(days, weeksPerMonth, daysPerWeek, stateClassNames) {
            var weeks = [];
            for (var i = weeksPerMonth - 1; i >= 0; i--) {
                var daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * (i + 1));
                var dateNames = assignState(daysInWeek, 'date', 'date', stateClassNames);
                weeks.unshift(dateNames);
            }
            return weeks;
        }
        function getWeeksOfMonth(month, weeksPerMonth, daysPerWeek, useWeeks, stateClassNames) {
            var daysForMonths = [month.daysInMonth];
            if (useWeeks) {
                daysForMonths.unshift(month.daysInPreviousMonth);
                daysForMonths.push(month.daysInNextMonth);
            }
            return splitMonthInWeeks([].concat.apply([], daysForMonths), weeksPerMonth, daysPerWeek, stateClassNames);
        }
    },
    function _4(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.renderInNode = renderInNode;
        exports.buildTable = buildTable;
        exports.buildList = buildList;
        function clearChildren(node) {
            while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
            }
        }
        function extendNode(node, data) {
            if (data['children']) {
                node.innerHTML = data['children'];
            }
            if (data.className) {
                data.className.forEach(function (className) {
                    return node.classList.add(className);
                });
            }
            if (data.data) {
                Object.keys(data.data).forEach(function (item) {
                    return node.dataset[item] = data.data[item];
                });
            }
            return node;
        }
        function renderInNode(target, node) {
            clearChildren(target);
            target.appendChild(node);
        }
        function buildTableRow(cells, cellNodeName) {
            var row = document.createElement('tr');
            var cell = document.createElement(cellNodeName);
            cells.forEach(function (value) {
                var cellInstance = cell.cloneNode(false);
                row.appendChild(value && Object.keys(value).length ? extendNode(cellInstance, value) : cellInstance);
            });
            return row;
        }
        function buildTable(headData, bodyData, footData) {
            var tableNode = document.createElement('table');
            if (headData) {
                var thead = document.createElement('thead');
                thead.appendChild(buildTableRow(headData, 'th'));
                tableNode.appendChild(thead);
            }
            if (bodyData) {
                (function () {
                    var tbody = document.createElement('tbody');
                    if (bodyData.length) {
                        bodyData.forEach(function (data) {
                            if (data.length) {
                                tbody.appendChild(buildTableRow(data, 'td'));
                            }
                        });
                    }
                    tableNode.appendChild(tbody);
                }());
            }
            if (footData) {
                var tfoot = document.createElement('tfoot');
                tfoot.appendChild(buildTableRow(footData, 'td'));
                tableNode.appendChild(tfoot);
            }
            return tableNode;
        }
        function buildList(listNodeName, listItemData) {
            var listNode = document.createElement(listNodeName);
            var listItemNode = document.createElement('li');
            listItemData.forEach(function (value) {
                var listItemInstance = listItemNode.cloneNode(false);
                listNode.appendChild(value && Object.keys(value).length ? extendNode(listItemInstance, value) : listItemInstance);
            });
            return listNode;
        }
    },
    function _5(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.getShiftedArray = getShiftedArray;
        exports.getDummyArray = getDummyArray;
        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            } else {
                return Array.from(arr);
            }
        }
        function getShiftedArray(length, shiftBy) {
            var items = [].concat(_toConsumableArray(Array(length).keys()));
            return items.splice(-shiftBy).concat(items);
        }
        function getDummyArray(n) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var a = [];
            for (var i = n; i > 0; i--) {
                a.push(value);
            }
            return a;
        }
    }
];
__paeckchen_require__(0);
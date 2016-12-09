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
        var _i18n = __paeckchen_require__(2).exports;
        var _date = __paeckchen_require__(1).exports;
        var _transform = __paeckchen_require__(3).exports;
        var _dom = __paeckchen_require__(4).exports;
        function datepicker(element, options) {
            var defaultOpts = {
                weeksPerMonth: 6,
                daysPerWeek: 7,
                useWeeks: true,
                containerSelector: '[data-role=container]',
                daysTargetSelector: '[data-role=days]',
                monthsTargetSelector: '[data-role=months]',
                yearsTargetSelector: '[data-role=years]',
                format: 'dd.mm.yyyy'
            };
            var inputNode = element.querySelector('[data-role=input]');
            var dateNow = new Date();
            var localOpts = {
                _value: inputNode.value,
                _maxDate: inputNode.max ? new Date(inputNode.max) : dateNow,
                _minDate: inputNode.min ? new Date(inputNode.min) : new Date(0),
                _selectedDate: inputNode.value ? (0, _date.parseDate)(inputNode.value) : undefined
            };
            var opts = Object.assign(defaultOpts, options, localOpts);
            console.log(opts);
            var dateNames = (0, _i18n.getDateNames)();
            var containerNode = void 0;
            var daysViewNode = void 0;
            var monthsViewNode = void 0;
            var yearsViewNode = void 0;
            function updatePicker(date) {
                var datesInMonth = (0, _date.getDatesInMonth)(date, opts._selectedDate.getDate(), opts._minDate, opts._maxDate);
                var month = (0, _transform.fillMonth)(datesInMonth, opts.weeksPerMonth, opts.daysPerWeek);
                var weeksOfMonth = [];
                var dateNamesAST = null;
                if (opts.useWeeks) {
                    weeksOfMonth = (0, _transform.splitMonthInWeeks)([].concat(month.daysInPreviousMonth, month.daysInMonth, month.daysInNextMonth), opts.weeksPerMonth, opts.daysPerWeek);
                    dateNamesAST = dateNames.days.map(function (item) {
                        return (0, _transform.convertToAST)(item);
                    });
                } else {
                    weeksOfMonth = (0, _transform.splitMonthInWeeks)(month.daysInMonth, opts.weeksPerMonth, opts.daysPerWeek);
                }
                var daysTable = (0, _dom.buildTable)(dateNamesAST, weeksOfMonth);
                var monthsAST = (0, _transform.assignState)((0, _date.getMonthsInYear)(dateNames.months, opts._selectedDate.getMonth()), 'month');
                var monthsList = (0, _dom.buildList)('ol', monthsAST, 'month');
                var yearsAST = (0, _transform.assignState)((0, _date.getYears)(opts._minDate.getFullYear(), opts._maxDate.getFullYear(), opts._selectedDate.getFullYear()), 'year');
                var yearsList = (0, _dom.buildList)('ol', yearsAST, 'years');
                (0, _dom.renderInNode)(daysViewNode, daysTable);
                (0, _dom.renderInNode)(monthsViewNode, monthsList);
                (0, _dom.renderInNode)(yearsViewNode, yearsList);
            }
            function handleChange(e) {
                var date = (0, _date.parseDate)(e.target.value, opts.format);
                if (!date) {
                    return;
                }
                opts._selectedDate = date;
                updatePicker(date);
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
        var input = document.querySelector('.date-input');
        datepicker(input);
    },
    function _1(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.parseDate = parseDate;
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
        function compareDates(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
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
                    disabled: tempDate.getTime() < minDate.getTime() || tempDate.getTime() > maxDate.getTime()
                });
            }
            return datesInMonth;
        }
        function getMonthsInYear(months, selectedMonth) {
            return months.map(function (item, index) {
                return {
                    month: item,
                    selected: index === selectedMonth
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
                    selected: year === selectedYear
                });
            }
            return years;
        }
    },
    function _2(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.getDateNames = getDateNames;
        function getDateNames() {
            var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.language;
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
    function _3(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.fillMonth = fillMonth;
        exports.assignState = assignState;
        exports.convertToAST = convertToAST;
        exports.splitMonthInWeeks = splitMonthInWeeks;
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
                if (deltaToNextMonth <= weeksPerMonth) {
                    daysInNextMonth = (0, _array.getDummyArray)(deltaToNextMonth, null);
                }
            }
            return {
                daysInPreviousMonth: daysInPreviousMonth,
                daysInMonth: daysInMonth,
                daysInNextMonth: daysInNextMonth
            };
        }
        function assignState(list, childrenKey) {
            var items = list.map(function (val) {
                if (!val) {
                    return;
                }
                var className = [];
                val.current && className.push('current');
                val.selected && className.push('selected');
                val.disabled && className.push('disabled');
                return convertToAST(val[childrenKey], { className: className });
            });
            return items;
        }
        function convertToAST(children, attrs) {
            return Object.assign({ children: children }, attrs);
        }
        function splitMonthInWeeks(days, weeksPerMonth, daysPerWeek) {
            var weeks = [];
            for (var i = weeksPerMonth - 1; i >= 0; i--) {
                var daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * (i + 1));
                var dateNames = assignState(daysInWeek, 'date');
                weeks.unshift(dateNames);
            }
            return weeks;
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
                            tbody.appendChild(buildTableRow(data, 'td'));
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
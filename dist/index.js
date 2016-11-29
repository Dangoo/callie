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
            var inputNode = element.querySelector('[data-role=input]');
            var opts = Object.assign({
                weeksPerMonth: 6,
                daysPerWeek: 7,
                useWeeks: true,
                containerSelector: '[data-role=container]',
                daysTargetSelector: '[data-role=days]',
                monthsTargetSelector: '[data-role=months]',
                yearsTargetSelector: '[data-role=years]',
                maxDate: inputNode.max && new Date(inputNode.max),
                minDate: inputNode.min && new Date(inputNode.min)
            }, options);
            console.log(opts);
            var selectedDate = {
                day: 12,
                month: 5,
                year: 2016
            };
            var dateNames = (0, _i18n.getDateNames)();
            var containerNode = void 0;
            var daysViewNode = void 0;
            var monthsViewNode = void 0;
            var yearsViewNode = void 0;
            function updatePicker(date) {
                var datesInMonth = (0, _date.getDatesInMonth)(date, selectedDate.day);
                var month = (0, _transform.fillMonth)(datesInMonth, opts.weeksPerMonth, opts.daysPerWeek);
                var daysTable = void 0;
                if (opts.useWeeks) {
                    var weeksOfMonth = (0, _transform.splitMonthInWeeks)([].concat(month.daysInPreviousMonth, month.daysInMonth, month.daysInNextMonth), opts.weeksPerMonth, opts.daysPerWeek);
                    var dateNamesAST = dateNames.days.map(function (item) {
                        return (0, _transform.convertToAST)(item);
                    });
                    daysTable = (0, _dom.buildTable)(dateNamesAST, weeksOfMonth);
                } else {
                    var _weeksOfMonth = (0, _transform.splitMonthInWeeks)(month.daysInMonth, opts.weeksPerMonth, opts.daysPerWeek);
                    daysTable = (0, _dom.buildTable)(null, _weeksOfMonth);
                }
                var monthsAST = (0, _transform.assignState)((0, _date.getMonthsInYear)(dateNames.months, selectedDate.month), 'month');
                var monthsList = (0, _dom.buildList)('ol', monthsAST, 'month');
                var yearsAST = (0, _transform.assignState)((0, _date.getYearsTo)(opts.maxDate, 100, selectedDate.year), 'year');
                var yearsList = (0, _dom.buildList)('ol', yearsAST, 'years');
                (0, _dom.renderInNode)(daysViewNode, daysTable);
                (0, _dom.renderInNode)(monthsViewNode, monthsList);
                (0, _dom.renderInNode)(yearsViewNode, yearsList);
            }
            function handleChange(e) {
                var value = e.target.value;
                var date = new Date((0, _transform.formatValue)(value, 'dd.mm.yyyy'));
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
                element.value = new Date().toISOString().slice(0, 10);
                containerNode = element.querySelector(opts.containerSelector);
                daysViewNode = containerNode.querySelector(opts.daysTargetSelector);
                monthsViewNode = element.querySelector(opts.monthsTargetSelector);
                yearsViewNode = containerNode.querySelector(opts.yearsTargetSelector);
                updatePicker(new Date());
            }
            init();
        }
        var input = document.querySelector('.date-input');
        datepicker(input);
    },
    function _1(module, exports) {
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
    function _2(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.getDaysPerMonth = getDaysPerMonth;
        exports.getDatesInMonth = getDatesInMonth;
        exports.getMonthsInYear = getMonthsInYear;
        exports.getYearsFrom = getYearsFrom;
        exports.getYearsTo = getYearsTo;
        function compareDates(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
        }
        function getDaysPerMonth(date) {
            var tempDate = new Date(date);
            tempDate.setMonth(tempDate.getMonth() + 1);
            tempDate.setDate(0);
            return tempDate.getDate();
        }
        function getDatesInMonth(date, selectedDay) {
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
                    selected: tempDate.getDate() === selectedDay
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
        function getYears(forwards, date, count, selectedYear) {
            var startDate = new Date(date).getFullYear();
            var years = [];
            if (forwards) {
                for (var i = count - 1; i >= 0; i--) {
                    var year = startDate + i;
                    years.push({
                        year: year,
                        selected: year === selectedYear
                    });
                }
            } else {
                for (var _i = count - 1; _i >= 0; _i--) {
                    var _year = startDate - _i;
                    years.push({
                        year: _year,
                        selected: _year === selectedYear
                    });
                }
            }
            return years.reverse();
        }
        function getYearsFrom(date, count, selectedYear) {
            return getYears(true, date, count, selectedYear);
        }
        function getYearsTo(date, count, selectedYear) {
            return getYears(false, date, count, selectedYear);
        }
    },
    function _3(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.formatValue = formatValue;
        exports.fillMonth = fillMonth;
        exports.assignState = assignState;
        exports.convertToAST = convertToAST;
        exports.splitMonthInWeeks = splitMonthInWeeks;
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
        function formatValue(valueString, format) {
            var parts = valueString.split('.');
            if (format === 'dd.mm.yyyy') {
                parts.reverse();
            }
            return parts.join('-');
        }
        function getSchiftedArray(length, shiftBy) {
            var items = [].concat(_toConsumableArray(Array(length).keys()));
            return items.splice(-shiftBy).concat(items);
        }
        var daysInWeekIndices = getSchiftedArray(7, 1);
        function shiftDayIndex(dayIndex) {
            var days = daysInWeekIndices;
            return days[dayIndex];
        }
        function getDummyArray(n) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var a = [];
            for (var i = n; i > 0; i--) {
                a.push(value);
            }
            return a;
        }
        function fillMonth(daysInMonth, weeksPerMonth, daysPerWeek) {
            var maxDaysInMonth = daysPerWeek * weeksPerMonth;
            var firstDayIndex = shiftDayIndex(daysInMonth[0].day);
            var daysInPreviousMonth = [];
            var daysInNextMonth = [];
            var deltaToPrevMonth = firstDayIndex;
            var deltaToNextMonth = (maxDaysInMonth - (daysInMonth.length + firstDayIndex)) % daysPerWeek;
            if (deltaToPrevMonth > 0) {
                daysInPreviousMonth = getDummyArray(firstDayIndex, null);
            }
            if (deltaToNextMonth > 0 && deltaToNextMonth <= weeksPerMonth) {
                daysInNextMonth = getDummyArray(deltaToNextMonth, null);
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
                var daysInWeek = days.slice(daysPerWeek * i, daysPerWeek * i + daysPerWeek);
                var dateNames = assignState(daysInWeek, 'date');
                weeks.unshift(dateNames);
            }
            return weeks;
        }
    },
    function _4(module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.buildTable = buildTable;
        exports.renderInNode = renderInNode;
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
        function getTableRow(cells, cellNodeName) {
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
                thead.appendChild(getTableRow(headData, 'th'));
                tableNode.appendChild(thead);
            }
            if (bodyData) {
                (function () {
                    var tbody = document.createElement('tbody');
                    if (bodyData.length) {
                        bodyData.forEach(function (data) {
                            tbody.appendChild(getTableRow(data, 'td'));
                        });
                    }
                    tableNode.appendChild(tbody);
                }());
            }
            if (footData) {
                var tfoot = document.createElement('tfoot');
                tfoot.appendChild(getTableRow(footData, 'td'));
                tableNode.appendChild(tfoot);
            }
            return tableNode;
        }
        function renderInNode(target, node) {
            clearChildren(target);
            target.appendChild(node);
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
    }
];
__paeckchen_require__(0);
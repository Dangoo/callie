// Imports methods and exposes them as public API e.g. datepickerAPI.getDatesNames()

export { getDateNames } from './helper/i18n';
import { isTouch } from './helper/touch';
export {
  parseDate,
  formatDate,
  dateInRange,
  getDatesInMonth,
  getMonthsInYear,
  getYears
} from './date';
export {
  fillMonth,
  getWeeksOfMonth,
  convertToAST,
  assignState
} from './transform';
export {
  buildTable,
  buildList,
  renderInNode
} from './helper/dom';

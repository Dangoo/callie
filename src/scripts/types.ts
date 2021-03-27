export interface InitOptions {
  weeksPerMonth: number;
  daysPerWeek: number;
  containerStateSelector: string;
  containerSelector: string;
  daysTargetSelector: string;
  monthsTargetSelector: string;
  yearsTargetSelector: string;
  inputTargetSelector: string;
  selectedStateClassName: string;
  currentStateClassName: string;
  disabledStateClassName: string;
  format: string;
  noTouch: boolean;
  isOpen: boolean;
  dateNamesFallback: {
    days: string[];
    months: string[];
  };
}

export interface LocalOptions {
  value?: string;
  maxDate: Date;
  minDate: Date;
  selectedDate?: Date | null;
  useWeeks: boolean;
  noTouch: boolean;
  isOpen: boolean;
  localClick: boolean;
}

export interface StateType {
  current: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface StateClassNames {
  current: string;
  selected: string;
  disabled: string;
}

export interface DateItem extends StateType {
  fullDate: Date;
  date: number;
  day: number;
}

export interface MonthItem extends StateType {
  month: number;
  monthName: string;
}

export interface YearItem extends Omit<StateType, "disabled"> {
  year: number;
}

export interface ElementData {
  children?: string;
  className?: string[];
  data?: DOMStringMap;
}

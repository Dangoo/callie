# &#x1f4c5; Callie

Callie is a lightweight modular datepicker splitted into three main components:
* Date logik (model)
* Transformation and mapping to prepare for view
* Render logik (view) Each of these components can be replaced by other solutions independently.

## JS options
| Name                 | Description                                                                           | Default                   |
|----------------------|---------------------------------------------------------------------------------------|---------------------------|
| weeksPerMonth        | (number) Amount of weeks per month.                                                   | `6`                       |
| daysPerWeek          | (number) Amount of days per week.                                                     | `7`                       |
| useWeeks             | (boolean) Render row with day name shorts in the month view.                          | `true`                    |
| containerSelector    | (string) Selector for the main container                                              | `'[data-role=container]'` |
| daysTargetSelector   | (string) Selector of node to insert days list in                                      | `'[data-role=days]'`      |
| monthsTargetSelector | (string) Selector of node to insert month list in                                     | `'[data-role=months]'`    |
| yearsTargetSelector  | (string) Selector of node to insert years list in                                     | `'[data-role=years]'`     |
| format               | (string) Date format to parse.                                                        | `'dd.mm.yyyy'`            |
| dateNamesFallback    | (object) Fallback for date names for browsers not supporting Internatinalization API. | English names             |

## CSS modifer
| Modifier | Description                         |
| -------- | ----------------------------------- |
| --slide  | Adds slide transition between views |
| --fade   | Adds fade transition between views  |

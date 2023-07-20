export const WEEKDAYS = 7
export const HOUR_COUNT = 24

export const getToday = () => new Date(Date.now())

export let selectedDate = getToday()

export const isSameWeek = (date1, date2) => {
    const week = getWeekDates(date1)
    const result = week.find(item => isSameDate(item, date2))
    return result ? true : false
}

export const isSameDate = (date1, date2) => {
    const year = date1.getFullYear() === date2.getFullYear() ? true : false 
    const month = date1.getMonth() === date2.getMonth() ? true : false 
    const date = date1.getDate() === date2.getDate() ? true : false 

    return year && month && date
}

export const getWeekDates = (date) => {

    const weekDay = date.getDay()
    const diffToMonday = ( weekDay - 1 + WEEKDAYS ) % WEEKDAYS
    const monday = incrementDay(date, -diffToMonday)
    const weekDays = []

    for (let index = 0; index < WEEKDAYS; index++) {
        weekDays.push( incrementDay(monday, index ) )
    }

    return weekDays

}

export const setSelectedDate = (date) => {
    selectedDate = date
}

export const incrementDay = (date, incrValue) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + incrValue)
}

export const incrementMonth = (date, incrValue) => {
    return new Date(date.getFullYear(), date.getMonth() + incrValue, 15)
}

export const updateCalendarLabels = ( parentElem, date ) => {    
    const monthLabel = parentElem.querySelector("[data-calendarLabel='month']")
    const yearLabel = parentElem.querySelector("[data-calendarLabel='year']")

    monthLabel.innerHTML = date.toLocaleDateString('us-US', {month: 'long'})
    yearLabel.innerHTML = date.getFullYear()
}
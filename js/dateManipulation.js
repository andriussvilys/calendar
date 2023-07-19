export const WEEKDAYS = 7

export let selectedDate = new Date( Date.now() )

export const isSameWeek = (date1, date2) => {
    const week = getWeekDates(date1)
    const result =  week.filter(item => isSameDate(item, date2))
    if( result.length > 0){
        return true
    }
    return false
}

export function isSameDate(date1, date2){
    const year = date1.getFullYear() === date2.getFullYear() ? true : false 
    const month = date1.getMonth() === date2.getMonth() ? true : false 
    const date = date1.getDate() === date2.getDate() ? true : false 

    return year && month && date
}

export const getWeekDates = (date) => {

    if(!date){
        date = new Date(Date.now())
    }

    const weekDay = date.getDay()
    const diffToMonday = (weekDay-1+7)%7
    const monday = new Date(date.getFullYear(), date.getMonth(), (date.getDate() - diffToMonday))
    const weekDays = []

    for (let index = 0; index < WEEKDAYS; index++) {
        weekDays.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index))
    }

    return weekDays

}

export const setSelectedDate = (date) => {
    selectedDate = date
}
import { isSameDate, getToday, WEEKDAYS, incrementMonth, LOCALE } from "../js/dateManipulation.js"
import { selectedDate, selectedMonth } from '../js/state.js'

const CALENDAR_ROWS = 6

const today = getToday()

document.querySelector("#months-next").addEventListener('click', () => {
    const nextDate = incrementMonth(selectedMonth.value, +1)
    selectedMonth.setState(nextDate)
})
document.querySelector("#months-prev").addEventListener('click', () => {
    const nextDate = incrementMonth(selectedMonth.value, -1)
    selectedMonth.setState(nextDate)
})

const toggleSelectedSecondary = ( date ) => {
    const buttons = document.querySelectorAll('.monthView-button.selected_secondary')
    buttons.forEach(elem => {
        elem.classList.remove('selected_secondary')
    })
    document.querySelector(`[data-timestamp='${date.valueOf()}']`)?.classList.add('selected_secondary')
}

const onMonthButtonClick = ( event ) => {
    const newDate = new Date(+event.target.dataset.timestamp)
    selectedDate.setState( newDate )
}

const generateDayCell = (content) => {
    const container = document.createElement('div')
    container.classList = `container monthView-cell`

    const button = document.createElement('button')
    button.classList = `button button_round monthView-button ${content.isToday ? 'button_today' : ''}`

    button.innerHTML = `${ new Date(content.date).getDate()}`

    button.dataset.timestamp = content.date.valueOf()

    button.addEventListener('click', onMonthButtonClick)

    container.appendChild(button)

    return container

}

export const switchMonth = ( newDate ) => {

    const months = document.querySelector("#month")
    months.innerHTML = ''
    const monthView = getMonthViewDays(newDate);

    monthView.forEach(date => {
        months.appendChild( generateDayCell(date) )
    })

}

const updateMonthYearLabels = ( date ) => {    
    const parentElem = document.querySelector('.monthView-label')
    const monthLabel = parentElem.querySelector("[data-calendarLabel='month']")
    const yearLabel = parentElem.querySelector("[data-calendarLabel='year']")

    monthLabel.innerHTML = date.toLocaleDateString(LOCALE, {month: 'long'})
    yearLabel.innerHTML = date.getFullYear()
}

const getMonthViewDays = (newDate) => {

    const year = newDate.getFullYear()
    const month = newDate.getMonth()

    const result = []
    
    const firstMonthDay = new Date(year, month).getDay()

    //get the day before the first day of current month, ie previous month length
    const prevMonthLength = new Date(year, month, 0).getDate();

    //days before current month
    for (let index = ((prevMonthLength - 7) + 1) + ((7 - firstMonthDay) + 1); index < prevMonthLength+1; index++) {
        result.push({date: new Date(year, month-1, index), isToday: false})
    }

    //current Month
    const monthLength = new Date(year, month+1, 0).getDate()

    for (let index = 1; index < monthLength+1; index++) {
        const isToday = isSameDate(today, new Date(newDate.getFullYear(), newDate.getMonth(), index))
        result.push({date: new Date(year, month, index), isToday: isToday})
    }

    const remainder = (WEEKDAYS * CALENDAR_ROWS) - result.length

    //days after current month
    for (let index = 1; index < remainder+1; index++) {
        result.push({date: new Date(year, month+1, index), isToday: false})
    }

    return result
}

switchMonth( selectedDate.value )

const onDateChange = ( date ) => {
    switchMonth( date )
    toggleSelectedSecondary( date )
    updateMonthYearLabels( date)
}

const onMonthChange = (date) => {
    switchMonth( date )
    updateMonthYearLabels( date)
}

selectedDate.addListener( onDateChange )
selectedMonth.addListener( onMonthChange )

updateMonthYearLabels(selectedDate.value)
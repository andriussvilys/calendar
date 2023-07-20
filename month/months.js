import { isSameDate, setSelectedDate, selectedDate, getToday, WEEKDAYS, incrementMonth } from "../js/dateManipulation.js"
import { switchWeekView } from "../js/weekView.js"


const CALENDAR_ROWS = 6

const today = getToday()
let selectedMonth = selectedDate

document.querySelector("#months-next").addEventListener('click', () => {
    const nextDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1)
    switchMonth( nextDate )
    selectedMonth = nextDate
    updateLabel(selectedMonth)
})
document.querySelector("#months-prev").addEventListener('click', () => {
    const nextDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1)
    switchMonth( nextDate )
    selectedMonth = nextDate
    updateLabel(selectedMonth)
})

function updateLabel( date ){    
    const monthViewLabelMonth = document.querySelector("#monthView-label-month")
    const monthViewLabelYear = document.querySelector("#monthView-label-year")
    monthViewLabelMonth.innerHTML = date.toLocaleDateString('us-US', {month: 'long'})
    monthViewLabelYear.innerHTML = date.getFullYear()
}

export function toggleSelectedSecondary( monthViewButton ){
    const buttons = document.querySelectorAll('.monthView-button')
    buttons.forEach(elem => {
        elem.classList.remove('selected_secondary')
    })
    monthViewButton.classList.add('selected_secondary')
}

export function findMonthButtonByDate( date ){

    const button = document.querySelector(`[data-date="${date.toString()}"]`)

    return button

}

function generateDayCell(content){
    const container = document.createElement('div')
    container.classList = `container monthView-cell`

    const button = document.createElement('button')
    button.classList = `button button_round monthView-button ${content.isToday ? 'button_today' : ''} ${content.currentMonth ? 'selectedMonth' : ''}`
    button.innerHTML = `${ new Date(content.date.string).getDate()}`
    button.dataset.date = content.date.string
    button.dataset.timestamp = content.date.timestamp
    button.dataset.currentMonth = content.currentMonth
    button.dataset.currentDay = content.isToday
    button.addEventListener('click', (e) => {
        const newDate = new Date(e.target.dataset.date)
        toggleSelectedSecondary(e.target)
        switchWeekView( newDate )
        setSelectedDate( newDate )
        updateLabel(selectedDate)
    })

    container.appendChild(button)

    return container

}

export function switchMonth( newDate ){

    const months = document.querySelector("#month")
    months.innerHTML = ''
    const monthView = getMonthViewDays(newDate);

    monthView.forEach(date => {
        months.appendChild( generateDayCell(date) )
    })

    updateLabel( selectedDate )
}

function getMonthViewDays(newDate){

    const year = newDate.getFullYear()
    const month = newDate.getMonth()

    const result = []
    
    const firstMonthDay = new Date(year, month).getDay()

    //get the day before the first day of current month, ie previous month length
    const prevMonthLength = new Date(year, month, 0).getDate();

    const getDateObj = (year, month, index) => { 
        const obj = {
            string: new Date(year, month, index).toString(),
            timestamp: new Date(year, month, index).valueOf()
        }
        return obj
     }

    //days before current month
    for (let index = ((prevMonthLength - 7) + 1) + ((7 - firstMonthDay) + 1); index < prevMonthLength+1; index++) {
        result.push({date: getDateObj(year, month-1, index), currentMonth: false, isToday: false})
    }

    //current Month
    const monthLength = new Date(year, month+1, 0).getDate()

    for (let index = 1; index < monthLength+1; index++) {
        const isToday = isSameDate(today, new Date(newDate.getFullYear(), newDate.getMonth(), index))
        result.push({date: getDateObj(year, month, index), currentMonth: true, isToday: isToday})
    }

    const remainder = (WEEKDAYS * CALENDAR_ROWS) - result.length

    //days after current month
    for (let index = 1; index < remainder+1; index++) {
        result.push({date: getDateObj(year, month+1, index), currentMonth: false, isToday: false})
    }

    return result
}

switchMonth( selectedDate )
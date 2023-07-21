import { getToday, WEEKDAYS } from "./dateManipulation.js"
import { selectedDate } from './state.js'

const button_today = document.querySelector("#button_today")
const headerControls_prev = document.querySelector("#headerControls_prev")
const headerControls_next = document.querySelector("#headerControls_next")

button_today.addEventListener('click', () => {
    const today = getToday()
    selectedDate.setState( today )
})

headerControls_prev.addEventListener('click', () => {
    handleNextPrevClick(-1)
})

headerControls_next.addEventListener('click', () => {
    handleNextPrevClick(1)
})

const handleNextPrevClick = (direction) => {
    const newDate = new Date( selectedDate.value.getFullYear(), selectedDate.value.getMonth(), selectedDate.value.getDate() + WEEKDAYS*direction ) 
    selectedDate.setState( newDate )
}

const updateCalendarLabels = ( date ) => {
    
    const parentElem = document.querySelector('header')
    const monthLabel = parentElem.querySelector("[data-calendarLabel='month']")
    const yearLabel = parentElem.querySelector("[data-calendarLabel='year']")

    monthLabel.innerHTML = date.toLocaleDateString('us-US', {month: 'long'})
    yearLabel.innerHTML = date.getFullYear()
}

selectedDate.addListener( updateCalendarLabels )
import { switchMonth, findMonthButtonByDate, toggleSelectedSecondary } from "../month/months.js"
import {switchWeekView} from "./weekView.js"
import { selectedDate, setSelectedDate, getToday, WEEKDAYS } from "./dateManipulation.js"

const button_today = document.querySelector("#button_today")
const headerControls_prev = document.querySelector("#headerControls_prev")
const headerControls_next = document.querySelector("#headerControls_next")

button_today.addEventListener('click', () => {
    const today = getToday()
    switchWeekView( today )
    switchMonth( today )
    setSelectedDate( today )
})

headerControls_prev.addEventListener('click', () => {
    handleNextPrevClick(-1)

})

headerControls_next.addEventListener('click', () => {
    handleNextPrevClick(1)
})

const handleNextPrevClick = (direction) => {
    const newDate = new Date( selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + WEEKDAYS*direction ) 
    switchWeekView( newDate )
    switchMonth (newDate)
    const monthButton = findMonthButtonByDate(newDate)
    if(monthButton){
        toggleSelectedSecondary(monthButton)
    }
    setSelectedDate( newDate )
}
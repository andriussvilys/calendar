"use strict"

const CALENDAR_ROWS = 6
const DAYS_IN_WEEK = 7

const today = new Date(Date.now())
let currentMonth = today.getMonth()
let currentYear = today.getFullYear()

document.querySelector("#months-next").addEventListener('click', () => {
    incrementMonth(1)
    fillMonth(currentYear, currentMonth)
})
document.querySelector("#months-prev").addEventListener('click', () => {
    incrementMonth(-1)
    fillMonth(currentYear, currentMonth)
})

function updateLabel(){
    const monthViewLabelMonth = document.querySelector("#monthView-label-month")
    const monthViewLabelYear = document.querySelector("#monthView-label-year")
    monthViewLabelMonth.innerHTML = new Date(currentYear, currentMonth).toLocaleDateString('us-US', {month: 'long'})
    monthViewLabelYear.innerHTML = currentYear
}

function incrementMonth(value){
    currentMonth += value
    if(currentMonth > 11){
        currentMonth = currentMonth%12
        currentYear++
    }
    if(currentMonth < 0){
        currentMonth += 12
        currentYear--
    }
}

function generateDayCell(content){
    const element = 
    `<div class="container monthView-cell">
        <button 
            class="button button_round monthView-button ${content.isToday ? 'button_today' : ''} ${content.currentMonth ? 'selectedMonth' : ''}"
            data-date='${content.date.string}' 
            data-timestamp=${content.date.timestamp}
            data-currentmonth=${content.currentMonth} 
            data-currentday=${content.isToday} 
            >
            ${ new Date(content.date.string).getDate()}
        </button>
    </div>
    `
    return element
}

function fillMonth( year, month ){
    // const today = new Date(Date.now());
    const monthView = getMonthViewDays(year, month);
    let html = ''
    monthView.forEach(elem => {
        html += generateDayCell(elem)
    })

    const months = document.querySelector("#month")
    months.innerHTML = html

    updateLabel()
}

function getMonthViewDays(year, month){

    const result = []
    
    const firstMonthDay = new Date(year, month).getDay()

    //get the day before the first day of current month, ie previous month length
    const prevMonthLength = new Date(year, month, 0).getDate();

    // const dateProp = (year, month, index) => { return Date.parse( new Date(year, month, index) ) }
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
        const isToday = isSameDate(today, new Date(currentYear, currentMonth, index))
        result.push({date: getDateObj(year, month, index), currentMonth: true, isToday: isToday})
    }

    const remainder = (DAYS_IN_WEEK * CALENDAR_ROWS) - result.length

    //days after current month
    for (let index = 1; index < remainder+1; index++) {
        result.push({date: getDateObj(year, month+1, index), currentMonth: false, isToday: false})
    }

    return result
}

function isSameDate(date1, date2){
    const year = date1.getFullYear() === date2.getFullYear() ? true : false 
    const month = date1.getMonth() === date2.getMonth() ? true : false 
    const date = date1.getDate() === date2.getDate() ? true : false 

    return year && month && date
}

fillMonth(currentYear, currentMonth)
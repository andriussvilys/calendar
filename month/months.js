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

function putInContainer(element){
    return `<div class="container monthView-cell">${element}</div>`
}

function generateCell(content){
    const element = 
    `<button 
        class="button button-round monthView-button"
        data-currentmonth=${content.currentMonth}
        data-currentday=${content.currentDay}
        >
        ${content.date}
    </button>`
    return putInContainer(element)
}

function fillMonth( year, month ){
    // const today = new Date(Date.now());
    const monthView = getMonthArray(year, month);
    let html = ''
    monthView.forEach(elem => {
        html += generateCell(elem)
    })

    const months = document.querySelector("#month")
    months.innerHTML = html

    updateLabel()
}

function getMonthArray(year, month){

    const result = []
    
    const firstMonthDay = new Date(year, month).getDay()

    //get the previous day of the first day of current month, ie previous month legth
    const prevMonthLength = new Date(year, month, 0).getDate();

    //days before current month
    for (let index = ((prevMonthLength - 7) + 1) + ((7 - firstMonthDay) + 1); index < prevMonthLength+1; index++) {
        result.push({date: index, currentMonth: false, currentDay: false})
    }

    //current Month
    const monthLength = new Date(year, month+1, 0).getDate()
    for (let index = 1; index < monthLength+1; index++) {
        const isToday = compareDates(today, new Date(currentYear, currentMonth, index))
        result.push({date: index, currentMonth: true, currentDay: isToday})
    }

    const remainder = (7*6) - result.length

    //days after current month
    for (let index = 1; index < remainder+1; index++) {
        result.push({date: index, currentMonth: false, currentDay: false})
    }

    return result
}

function compareDates(date1, date2){
    const year = date1.getFullYear() === date2.getFullYear() ? true : false 
    const month = date1.getMonth() === date2.getMonth() ? true : false 
    const date = date1.getDate() === date2.getDate() ? true : false 

    return year && month && date
}

fillMonth(currentYear, currentMonth)
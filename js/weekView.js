"use strict"

function isSameDate(date1, date2){
    const year = date1.getFullYear() === date2.getFullYear() ? true : false 
    const month = date1.getMonth() === date2.getMonth() ? true : false 
    const date = date1.getDate() === date2.getDate() ? true : false 

    return year && month && date
}

const ROW_COUNT = 25
const WEEKDAYS = 7
const LOCALE = 'us-US'

const weekView = document.querySelector('.weekView-main')

weekView.addEventListener('click', (e) => {
    if(e.target.classList.contains('day-border')){
        e.target.style.background = 'black';
    }
})

document.querySelector('#month').addEventListener('click', (e) => {

    if(e.target.dataset.date){
        // console.log( (e.target.dataset.timestamp) )
        // console.log( new Date(e.target.dataset.timestamp)  )
        // console.log( (e.target.dataset.date)  )
        // console.log( new Date(e.target.dataset.date)  )
    
        generateWeekView( new Date(e.target.dataset.date) )
    }


})

const createDayColumn = (date) => {

    const today = new Date(Date.now())

    const columnContainer = document.createElement('div')
    columnContainer.classList.add('weekView-column')

    const headerCell = document.createElement('div')
    headerCell.classList = `container header-cell`

    const headerLabel = document.createElement('div')
    headerLabel.classList = 'container day-label'

    const weekday = document.createElement('span')
    weekday.classList = `${isSameDate(date, today) ? 'date_today' : '' }`
    weekday.innerHTML = date.toLocaleDateString(LOCALE, { weekday: 'short'}).toUpperCase()

    const button_content = document.createElement('span')
    button_content.innerHTML = date.toLocaleDateString(LOCALE, { day: 'numeric'})
    const button = document.createElement('button')
    button.innerHTML = date.toLocaleDateString(LOCALE, { day: 'numeric'})
    button.classList = `button button_weekView button_round ${isSameDate(date, today) ? 'button_today' : ''}`
    // button.appendChild(button_content)

    const eventCell = document.createElement('div')
    eventCell.classList = 'day-border eventCell_header'

    headerLabel.appendChild(weekday)
    headerLabel.appendChild(button)

    headerCell.appendChild(headerLabel)
    headerCell.appendChild(eventCell)

    columnContainer.appendChild(headerCell)

    for (let index = 0; index < ROW_COUNT-1; index++) {
        const cell = document.createElement('div')
        cell.classList.add('day-border')
        columnContainer.appendChild(cell)
    }

    return columnContainer

}

const createHourCell = (hour, meridiam) => {

    const container = document.createElement('div')
    container.classList = "hour"

    const labelContainer = document.createElement('div')
    labelContainer.classList = "hour-labelContainer"

    const labelContent = document.createElement('div')
    labelContent.classList = 'hour-labelContent'

    const hourSpan = document.createElement('span')
    hourSpan.innerHTML = hour

    const spaceSpan = document.createElement('span')
    spaceSpan.innerHTML = " "

    const meridiamSpan = document.createElement('span')
    meridiamSpan.innerHTML = meridiam

    labelContent.appendChild(hourSpan)
    labelContent.appendChild(spaceSpan)
    labelContent.appendChild(meridiamSpan)

    labelContainer.appendChild(labelContent)

    const hourSeparator = document.createElement('div')
    hourSeparator.classList = 'hour-separator'

    container.appendChild(labelContainer)
    container.appendChild(hourSeparator)

    return container

}

const createHoursColumn = () => {

    const container = document.createElement('div')
    container.classList = "weekView-column hours"

    const headerCell = document.createElement('div')
    headerCell.classList = "hour header-cell"

    const hourSeparator = document.createElement('div')
    hourSeparator.classList = "hour-separator"

    headerCell.appendChild(hourSeparator)

    container.appendChild(headerCell)

    for (let index = 1; index < 12; index++) {
        const cell = createHourCell(index, 'AM')
        container.appendChild(cell)
    }
    const cell = createHourCell(12, 'PM')
    container.appendChild(cell)

    for (let index = 1; index < 12; index++) {
        const cell = createHourCell(index, 'PM')
        container.appendChild(cell)
    }

    return container
}

const getWeekDates = (date) => {

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

const generateWeekView = (date) => {

    weekView.innerHTML = ''

    weekView.appendChild( createHoursColumn() )

    const weekDates = getWeekDates(date)

    for (const date of weekDates) {
        const column = createDayColumn( date )
        weekView.appendChild(column)
    }

}

generateWeekView()

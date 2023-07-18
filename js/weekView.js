"use strict"

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
    console.log(e.target)
})

const createColumn = (date) => {

    const columnContainer = document.createElement('div')
    columnContainer.classList.add('weekView-column')

    const headerCell = document.createElement('div')
    headerCell.classList = 'container header-cell'

    const headerLabel = document.createElement('div')
    headerLabel.classList = 'container day-label'

    const weekday = document.createElement('span')
    weekday.innerHTML = date.toLocaleDateString(LOCALE, { weekday: 'short'}).toUpperCase()

    const button_content = document.createElement('span')
    button_content.innerHTML = date.toLocaleDateString(LOCALE, { day: 'numeric'})
    const button = document.createElement('button')
    button.appendChild(button_content)

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

    const weekDates = getWeekDates(date)

    for (const date of weekDates) {
        const column = createColumn( date )
        weekView.appendChild(column)
    }

}

generateWeekView()

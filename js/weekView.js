import { isSameDate, isSameWeek, getWeekDates, getToday, HOUR_COUNT, LOCALE } from "../js/dateManipulation.js"
import {selectedDate, storageState} from './state.js'
import {findByHour} from './database.js'
import { displayModal } from "./event.js"

const EVENTBUBBLE_OFFSET = 25

const sortByKey = (objectArray, key) => {
    return objectArray.sort( (a,b) => {
        if(a[key] < b[key]){
            return 1
        }
        if(b[key] < a[key]){
            return -1
        }
        return 0

    })
}

const createEventCard = (eventId, targetElem) => {

    const event = JSON.parse(localStorage.getItem(eventId))
    // console.log(eventId, targetElem)

    const container = document.createElement('div')
    container.classList = "container eventCard"

    // console.log(DOMevent)
    const DOMrect = targetElem.getBoundingClientRect()
    const elemCenter = DOMrect.left + DOMrect.width / 2
    const HTMLbodyWidth = document.querySelector('body').getBoundingClientRect().width

    console.log({elemCenter, bodyCenter: HTMLbodyWidth/2})
    if(elemCenter > (HTMLbodyWidth/2)){
        container.classList.add("slideIn_ltr")
        container.style.right = '100%'
    }
    else{
        container.classList.add("slideIn_rtl")
        container.style.left = '100%'
    }


    const controls = document.createElement('div')
    controls.classList = ("container eventCard-controls")

    const eventCardButtonClassList = "button button_round eventCard-button"
    const deleteButton = document.createElement('button')
    deleteButton.classList = eventCardButtonClassList
    const deleteIcon = document.createElement('img')
    deleteIcon.src = '../images/delete_FILL0_wght400_GRAD0_opsz48.svg'
    deleteButton.append(deleteIcon)
    deleteButton.addEventListener('click', () => {
        localStorage.removeItem(eventId)
        container.remove()
    })
    controls.append(deleteButton)

    const closeButton = document.createElement('button')
    closeButton.classList = eventCardButtonClassList
    const closeIcon = document.createElement('img')
    closeIcon.src = '../images/close_FILL0_wght400_GRAD0_opsz48.svg'
    closeButton.append(closeIcon)
    closeButton.addEventListener('click', () => {
        container.remove()
    })
    controls.append(closeButton)

    container.append(controls)

    const eventCardData = document.createElement('div')
    eventCardData.classList = "container eventCardData"

    const title = document.createElement('h2')
    title.innerHTML = event.title
    eventCardData.append(title)

    const date = document.createElement('p')

    const startDate = new Date(event.startDate)
    const dateString = startDate.toLocaleDateString(LOCALE, {weekday:'long', month: 'long', day: 'numeric'})

    const timeString_start = startDate.toLocaleTimeString('us-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    const timeString_end = new Date(event.endDate).toLocaleTimeString('us-US', {hour: 'numeric', minute: 'numeric', hour12: true})

    date.innerHTML = `<span>${dateString}</span><span> ⋅ </span><span>${timeString_start} — ${timeString_end}</span>`
    eventCardData.append(date)

    if(event.description){
        const description = document.createElement('p')
        description.classList = "eventCardData-description"
        description.innerHTML = event.description
        eventCardData.append(description)
    }

    container.append(eventCardData)

    return container
}

const createEventBubble = (event) => {
    const container = document.createElement('div')
    container.classList.add('eventBubble-container')
    container.dataset.eventId = event.id

    const title = document.createElement('span')
    title.classList.add('eventBubble-title')
    title.innerHTML = event.title + ', '
    container.append(title)

    const time = document.createElement('span')
    const startDate = new Date(event.startDate)
    time.innerHTML = startDate.toTimeString().slice(0, 5)
    time.innerHTML += '—'
    const endDate = new Date(event.endDate)
    time.innerHTML += endDate.toTimeString().slice(0, 5)

    container.append(time)
    return container
}

const createTimeslot = ( timeslotArray ) => {

    //longest events should appear on left side of timeslot
    const sorted = sortByKey(timeslotArray, 'duration')

    const container = document.createElement('div')
    container.classList = 'timeslot'

    // eventBubble width depends on the number of rightSiblingCount
    sorted.forEach((event, index) => {

        const rightSiblingCount = timeslotArray.slice(index, timeslotArray.left).length
        const eventBubble = createEventBubble(event)
        eventBubble.style.height = `${event.duration * EVENTBUBBLE_OFFSET}%`
        const offset = index * EVENTBUBBLE_OFFSET 
        
        eventBubble.style.left = `${offset}%`
        const widthReduction = Math.max(0, rightSiblingCount-1) * EVENTBUBBLE_OFFSET
        eventBubble.style.width = `${100 - offset -  widthReduction}%`
        container.append(eventBubble)
    })

    return container
}

const createDayCell = (timestamp) => {
    const cell = document.createElement('div')
    cell.classList = 'day-border dayCell'
    cell.dataset.timestamp = timestamp.valueOf()
    const events = findByHour(timestamp)

    if(events.length > 0){

        const sorted = sortByKey(events, 'startDate')
        
        const timeSlots = [[],[],[],[]]
        sorted.forEach(event => {
            timeSlots[event.timeSlot].push(event)
        })

        const timeSlotElements = timeSlots.map( timeslotArray => {
            return createTimeslot(timeslotArray)
        } )

        // timeslot width depends on the size of surrounding timeslots
        timeSlotElements.forEach((elem, index) => {
            if(index > 0){
                const prevTimeslotSize = timeSlots.slice(0, index).reduce((acc, prevArray) => {
                    return Math.max(acc, prevArray.length)
                }, 0)
                const nextTimeSlotSize =  timeSlots.slice(index+1, 4).reduce((acc, nextArr) => {
                    return Math.max(acc, nextArr.length-1)
                }, 0)
                const offset = Math.max(prevTimeslotSize, nextTimeSlotSize)
                elem.style.left = `${prevTimeslotSize * 20}%`
                elem.style.width = `${100 -  offset * 20}%`
                elem.style.top = `${index * EVENTBUBBLE_OFFSET}%`
                elem.dataset.timestamp = timestamp.valueOf()
            }
            cell.append(elem)
        })

    }

    return cell
}

const createDayColumn = (date) => {

    const today = getToday()

    const columnContainer = document.createElement('div')
    columnContainer.classList.add('weekView-column')

    const headerCell = document.createElement('div')
    headerCell.classList = `container header-cell`

    const headerLabel = document.createElement('div')
    headerLabel.classList = 'container day-label'

    const weekday = document.createElement('span')
    weekday.classList = `${isSameDate(date, today) ? 'date_today' : '' }`
    weekday.innerHTML = date.toLocaleDateString(LOCALE, { weekday: 'short'}).toUpperCase()

    const button = document.createElement('button')
    button.innerHTML = date.toLocaleDateString(LOCALE, { day: 'numeric'})
    button.classList = `button weekView-button button_round ${isSameDate(date, today) ? 'button_today' : ''}`

    const eventCell = document.createElement('div')
    eventCell.classList = 'day-border eventCell_header'

    headerLabel.appendChild(weekday)
    headerLabel.appendChild(button)

    headerCell.appendChild(headerLabel)
    headerCell.appendChild(eventCell)

    columnContainer.appendChild(headerCell)

    for (let index = 0; index < HOUR_COUNT; index++) {
        const timestamp = new Date(date)
        timestamp.setHours(index)
        // console.log(timestamp)
        const cell = createDayCell(timestamp)
        columnContainer.appendChild(cell)
    }

    return columnContainer

}

const createHourCell = (date) => {

    let hour = (date.getHours())%12 || 12
    let meridiam = Math.floor(date.getHours() / 12) == 0 ? 'AM' : 'PM';

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

    for (let index = 1; index < HOUR_COUNT; index++) {
        const cell = createHourCell( new Date(0, 0, 0, index) )
        container.appendChild(cell)
    }

    return container
}

const generateWeekView = (date) => {

    const weekView = document.createElement('div')
    weekView.classList = "weekView-main"

    weekView.appendChild( createHoursColumn() )

    weekView.addEventListener('click', e => {
        if(e.target.dataset.timestamp){
            displayModal(e, new Date( parseInt(e.target.dataset.timestamp) ))
        }
        else if(e.target.dataset.eventId){
            console.log(e.target.getBoundingClientRect())
            const eventCard = createEventCard(e.target.dataset.eventId, e.target)
            e.target.parentElement.append(eventCard)
        }
    })

    const weekDates = getWeekDates(date)

    for (const date of weekDates) {
        const column = createDayColumn( date )
        weekView.appendChild(column)
    }

    return weekView

}

let prevWeekView
let prevTimeout

export const switchWeekView = ( nextDate, prevDate ) => {

    if (prevWeekView) {
        clearTimeout(prevTimeout)
        prevWeekView?.remove()
        prevWeekView = null
    }

    const wrapper = document.querySelector('.weekView-wrapper')
    const weekView_current = document.querySelector('.weekView-main')

    const weekView_new = generateWeekView(nextDate)
    wrapper.appendChild(weekView_new)
    
    if( prevDate && !isSameWeek(nextDate, prevDate) ){
        const slideInClass = nextDate > prevDate ? 'slideIn_ltr' : 'slideIn_rtl'
        weekView_new.classList.add(slideInClass)
    }
        
    prevWeekView =  weekView_current
    prevTimeout = setTimeout(() => {
        weekView_current?.remove()
    }, 200);

}

switchWeekView( selectedDate.value, selectedDate.prev )

selectedDate.addListener( switchWeekView )
storageState.addListener( switchWeekView )
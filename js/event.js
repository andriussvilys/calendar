import { FormData } from "./database.js"
import { MILISECOND_HOUR, getToday } from "./dateManipulation.js"
import { selectedDate, storageState } from "./state.js"

const TIMESLOT_LENGTH = 15

const eventModal = document.querySelector("#eventModal")
const eventForm = document.querySelector("#eventForm")
const eventButtons_create = document.querySelectorAll('.create');
const eventButton_cancel = document.querySelector("#event-cancel")
const eventButton_save = document.querySelector("#event-save")
const eventDate = document.querySelector('#event-date')
const startTime = document.querySelector('#event-startTime')
const endTime = document.querySelector('#event-endTime')

//takes in string in form of 'HH:MM'
const parseTimeString = (string) => {
    const result = {}
    result.hour = parseInt(string.slice(0, 2))
    result.minutes = parseInt(string.slice(3, 5))
    return result
}

const collectFormData = () => {

    const formData = new FormData()

    const inputData = {}
    const inputs = document.querySelectorAll('[data-key]')

    inputs.forEach(input => {
        if(input.required && !input.value){
            throw(`Required field (${input.dataset.key}) skipped`)
        }
        const key = input.dataset.key
        const value = input.value
        inputData[key] = value ? value : null
    })

    formData.title = inputData.title

    const { startTime : startTimeString, endTime : endTimeString} = inputData

    if(inputData.date && startTimeString && endTimeString){

        const startTime = parseTimeString(startTimeString)
        const startDate = new Date(inputData.date)
        startDate.setHours(startTime.hour, startTime.minutes)
        formData.startDate = Date.parse(startDate)
    
        const endTime = parseTimeString(endTimeString)
        const endDate = new Date(inputData.date)
        endDate.setHours(endTime.hour, endTime.minutes)
        formData.endDate = Date.parse(endDate)

        formData.duration = Math.ceil( (formData.endDate - formData.startDate) / (MILISECOND_HOUR/4) )
        formData.timeSlot = Math.floor( startTime.minutes /  TIMESLOT_LENGTH)
        formData.cellTimestamp = startDate.setMinutes(0).valueOf()
    }

    formData.setId()
    formData.createdAt = getToday().valueOf()
    formData.description = inputData.description

    localStorage.setItem(formData.id, JSON.stringify(formData))
    storageState.setState( formData )
    
}

eventButton_save.addEventListener('click', e => {
    try{
        collectFormData()
        toggleDisplay()
        e.preventDefault()
    }
    catch(e){
        console.error(e)
    }
})

const setFormInputValues = (date) => {
    const time = date.toTimeString().slice(0, 5)
    //use 'lt-LT' as locale to correctly form date as YYYY-MM-DD
    const YMDdate = date.toLocaleDateString('lt-LT', {year: 'numeric', month: 'numeric', day: 'numeric'})
    eventDate.value = YMDdate
    startTime.value = time
    endTime.value = time
}

eventButtons_create.forEach(btn => {
    btn.addEventListener('click', (e) => {
        displayModal(e, getToday() )
    })
})

export const displayModal = (e, date) => {
    toggleDisplay()
    setFormInputValues( date )
}

eventButton_cancel.addEventListener('click', (e) => {
    // eventForm.classList.remove('slideIn_ltr')
    eventForm.classList.add('slideOut_rtl')
    setTimeout(() => {
        eventModal.classList.add('display-none')
        eventForm.classList.remove('slideOut_rtl')
    }, 400);
})

const toggleDisplay = () => {
    resetForm()
    eventModal.classList.toggle('display-none')
    eventForm.classList.add('slideIn_ltr')
}

const resetForm = () => {
    const form = document.querySelector("#eventForm")
    form.reset()
}
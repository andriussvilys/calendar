import { FormData } from "./database.js"
import { MILISECOND_HOUR, getToday } from "./dateManipulation.js"

const TIMESLOT_LENGTH = 15

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
        // console.log({startTime: formData.startDate, endTime: formData.endDate, diff: formData.endDate - formData.startDate, MILISECOND_HOUR, duration: formData.duration})
        formData.timeSlot = Math.floor( startTime.minutes /  TIMESLOT_LENGTH)
    }

    formData.setId()
    formData.createdAt = getToday().valueOf()

    localStorage.setItem(formData.id, JSON.stringify(formData))
    
}

const eventButtons_create = document.querySelectorAll('.create');
const eventModal = document.querySelector("#eventModal")
const eventButton_cancel = document.querySelector("#event-cancel")
const eventButton_save = document.querySelector("#event-save")

eventButton_save.addEventListener('click', e => {
    try{
        collectFormData()
        toggleDisplay(e)
        e.preventDefault()
    }
    catch(e){
        console.error(e)
    }
})

const title = document.querySelector('#event-title')
const eventDate = document.querySelector('#event-date')
const startTime = document.querySelector('#event-startTime')
const endTime = document.querySelector('#event-endTime')

const setDefaultInputValues = () => {
    const now = getToday()
    const time = now.toTimeString().slice(0, 5)
    eventDate.value = now.toJSON().slice(0,10)
    startTime.value = time
    endTime.value = time
}

eventButtons_create.forEach(btn => {
    btn.addEventListener('click', (e) => {
        toggleDisplay(e)
        setDefaultInputValues()
    })
})

eventButton_cancel.addEventListener('click', (e) => {
    toggleDisplay(e)
})

const toggleDisplay = () => {
    resetForm()
    const eventModal = document.querySelector("#eventModal")
    eventModal.classList.toggle('display-none')
}

const resetForm = () => {
    const form = document.querySelector("#eventForm")
    form.reset()
}
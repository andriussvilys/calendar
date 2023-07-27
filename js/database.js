import { getToday, incrementDay, isSameDate, MILISECOND_HOUR } from "./dateManipulation.js"

if(!localStorage.getItem("eventId")){
    localStorage.setItem("eventId", 0)
}

const findByDate = (date) => {
    const nextEventId = localStorage.getItem("eventId")

    const result = []

    for (let i = 0; i < nextEventId; i++) {
        const eventString = localStorage.getItem(i)
        if(eventString){
            const eventObj = JSON.parse(eventString)
            if(isSameDate(date, new Date(eventObj.startDate))){
                result.push(eventObj)
            }
        }
    }

    return result
}

export const findByHour = (timestamp) => {
    const nextEventId = localStorage.getItem("eventId")

    const result = []

    const date = new Date(timestamp)
    const hourStart = new Date(timestamp).setHours(date.getHours(),0,0).valueOf()

    for (let i = 0; i < nextEventId; i++) {
        const eventString = localStorage.getItem(i)
        if(eventString){
            const eventObj = JSON.parse(eventString)
            const diff = (eventObj.startDate - hourStart) 
            if( diff >= 0 && diff < MILISECOND_HOUR){
                result.push(eventObj)
            }
        }
    }

    return result
}

export const FormData = function(){
    this.id = null,
    this.title = null,
    this.startDate = null,
    this.endDate = null,
    this.description = null
    this.duration = null,
    this.setId = () => {
        if(!this.id){
            const id = parseInt( localStorage.getItem("eventId") )
            this.id = id
            localStorage.setItem("eventId", id+1)
        }
        return this
    }
}

// findByDate( getToday() ) 

findByHour( getToday() )
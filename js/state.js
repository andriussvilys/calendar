import { getToday } from "./dateManipulation.js"

const State = function(  ){
    this.value = null
    this.prev = null

    this.listeners = []

    this.addListener = ( cb ) => {
        this.listeners.push( cb )
    }

    this.setState = (value) => {
        this.prev = this.value
        this.value = value
        this.listeners.forEach( callback => callback( this.value ))
    }

}

export const selectedDate = new State()
export const selectedMonth = new State()

setTimeout(() => {
    selectedDate.setState( getToday() )
    selectedMonth.setState( selectedDate.value )
}, 400);
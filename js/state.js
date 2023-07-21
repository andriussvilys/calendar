import { getToday } from "./dateManipulation.js"

const State = function( data ){
    this.value = data
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

export const selectedDate = new State( getToday())
export const selectedMonth = new State(getToday())
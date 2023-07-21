import { getToday } from "./dateManipulation.js"

const State = function( data ){
    this.value = data
    this.prev = null

    this.listeners = []
}

State.prototype.addListener = function( cb ){
    this.listeners.push( cb )
}

State.prototype.setState = function(value){
    this.prev = this.value
    this.value = value
    this.listeners.forEach( callback => callback( this.value ))
}

console.log(State.prototype)

export const selectedDate = new State( getToday())
export const selectedMonth = new State(getToday())
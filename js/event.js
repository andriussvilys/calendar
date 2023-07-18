"use strict"

const eventButtons_create = document.querySelectorAll('.create');
const eventModal = document.querySelector("#eventModal")
const eventButton_cancel = document.querySelector("#event-cancel")
const eventButton_save = document.querySelector("#event-save")

const eventButtons = document.querySelectorAll('#eventModal button')

eventButtons.forEach(btn => {
    btn.addEventListener('click', (e) => e.preventDefault())
})

eventButtons_create.forEach(btn => {
    btn.addEventListener('click', () => toggleDisplay())
})

eventButton_cancel.addEventListener('click', () => toggleDisplay())
eventButton_save.addEventListener('click', () => toggleDisplay())

const toggleDisplay = () => {
    const eventModal = document.querySelector("#eventModal")
    if(eventModal.classList.contains('display-none')){
        eventModal.classList.remove('display-none')
    }
    else{
        eventModal.classList.add('display-none')
    }
}
if(!localStorage.getItem("eventId")){
    localStorage.setItem("eventId", 0)
}
if(!localStorage.getItem("events")){
    localStorage.setItem("events", [])
}

const FormData = function(){
    this.id = null,
    this.title = null,
    this.date = null,
    this.startTime = null,
    this.endTime = null,
    this.description = null
}

const collectFormData = () => {

    const formData = new FormData()

    const inputs = document.querySelectorAll('[data-key]')

    inputs.forEach(input => {
        const key = input.dataset.key
        const value = input.value
        formData[key] = value ? value : null
    })

    const id = parseInt( localStorage.getItem("eventId") )
    formData.id = id
    localStorage.setItem("eventId", id+1)

    localStorage.setItem(id, JSON.stringify(formData))

    console.log(formData)

}

const eventButtons_create = document.querySelectorAll('.create');
const eventModal = document.querySelector("#eventModal")
const eventButton_cancel = document.querySelector("#event-cancel")
const eventButton_save = document.querySelector("#event-save")

eventButton_save.addEventListener('click', e => {
    collectFormData()
})

const title = document.querySelector('#event-title')
const eventDate = document.querySelector('#event-date')
const startTime = document.querySelector('#event-startTime')
const endTime = document.querySelector('#event-endTime')

const eventButtons = document.querySelectorAll('#eventModal button')

eventButtons.forEach(btn => {
    btn.addEventListener('click', (e) => e.preventDefault())
})

eventButtons_create.forEach(btn => {
    btn.addEventListener('click', (e) => toggleDisplay(e))
})

eventButton_cancel.addEventListener('click', (e) => toggleDisplay(e))
eventButton_save.addEventListener('click', (e) => toggleDisplay(e))

const toggleDisplay = (e) => {
    e.preventDefault()
    const eventModal = document.querySelector("#eventModal")
    eventModal.classList.toggle('display-none')
}
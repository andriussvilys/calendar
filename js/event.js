
const eventButtons_create = document.querySelectorAll('.create');
const eventModal = document.querySelector("#eventModal")

const eventButtons = document.querySelectorAll('#eventModal button')

eventButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
    })
})

eventButtons_create.forEach(btn => {
    btn.addEventListener('click', () => {
        if(eventModal.classList.contains('display-none')){
            eventModal.classList.remove('display-none')
        }
        else{
            eventModal.classList.add('display-none')
        }
    })
})
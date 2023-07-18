"use strict"

const calendarDays = document.querySelector('.weekView-main')

calendarDays.addEventListener('click', (e) => {
    if(e.target.classList.contains('day-border')){
        e.target.style.background = 'black';
    }
})
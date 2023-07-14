
function putInContainer(element){
    return `<div class="container monthView-cell">${element}</div>`
}

function generateCell(content){
    const element = 
    `<button 
        class="button button-round monthView-button"
        data-currentmonth=${content.currentMonth}
        >
        ${content.date}
    </button>`
    return putInContainer(element)
}

function fillMonth( date ){
    // const today = new Date(Date.now());
    const monthView = getMonthArray(date.getFullYear(), date.getMonth());
    let html = ''
    monthView.forEach(elem => {
        html += generateCell(elem)
    })

    const months = document.querySelector("#month")
    months.innerHTML = html
}

function getMonthArray(year, month){

    const result = []
    
    const firstMonthDay = new Date(year, month).getDay()

    //get the previous day of the first day of current month, ie previous month legth
    const prevMonthLength = new Date(year, month, 0).getDate();

    //days before current month
    for (let index = ((prevMonthLength - 7) + 1) + ((7 - firstMonthDay) + 1); index < prevMonthLength+1; index++) {
        result.push({date: index, currentMonth: false})
    }

    //current Month
    const monthLength = new Date(year, month+1, 0).getDate()
    for (let index = 1; index < monthLength+1; index++) {
        result.push({date: index, currentMonth: true})
    }

    const remainder = (7*6) - result.length

    //days after current month
    for (let index = 1; index < remainder+1; index++) {
        result.push({date: index, currentMonth: false})
    }

    return result
}

fillMonth(new Date(Date.now()))
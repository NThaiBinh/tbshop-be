
function CreateKey(prefix) {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return prefix + 
    (day < 10 ? '0' + day : day) + 
    (month < 10 ? '0' + month : month) + 
    date.getFullYear() +
    (hours < 10 ? '0' + hours : hours) + 
    (minutes < 10 ? '0' + minutes : minutes) + 
    (seconds < 10 ? '0' + seconds : seconds)
    
}

function GetDate() {
    const date = new Date()
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = {
    CreateKey,
    GetDate
}
const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    //NEW message
    const $newMessage = $messages.lastElementChild
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMssgHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of message containers
    const containerHeight = $messages.scrollHeight

    //how far i scrolled!
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight-newMssgHeight <= scrollOffset) {
            $messages.scrollTop = $messages.scrollHeight
    }

    // console.log(newMssgHeight)

}

socket.on('message', (message) => {
    // whole message here goes :)

    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// seperate location from message event 
socket.on('location', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username:message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    //   console.log(url)
})

socket.on('roomData',({room,users})=> {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html

})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = document.querySelector('input').value
    // const message = e.target.elements.message.value

    $messageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()


        //callback server
        if (error) {
            return console.log(error)
        }
        console.log('the message was delivered')
    })

})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Gelocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log('position obj',position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared')
        })
    })

})

socket.emit('join', { username, room },(error)=>{
    console.log(username,room)
    if(error) {
        alert(error)
        location.href='/'
    }
})



// socket.on('countUpdated',(count)=>{
//     console.log('the count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('click')
//     socket.emit('increment')
// })
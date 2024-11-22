const socket = io()
// Element

const messageForm = document.querySelector('#Message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const button = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

//Template
const messageTemplate =document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

//Options


socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
    message: message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log( message);
    const html = Mustache.render(locationTemplate, {
      url:message.url,
      createdAt:moment(message.createdAt).format('h:mm a'),

    })
    messages.insertAdjacentHTML('beforeend', html);
});

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault(); 

    messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        
       if(error){
            return console.log(error)
       }

       console.log('message delivered')
    })
})



button.addEventListener('click', () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }
    
    button.setAttribute('disabled', 'disabled');
  
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, () => {
        console.log('Location shared!');
        button.removeAttribute('disabled');
      });
  
    }, () => {
      button.removeAttribute('disabled');
      console.log('Failed to get location');
    });
  });
  
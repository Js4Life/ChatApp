const express = require('express')
const path = require('path')

const { generateMessage , generateLocationMessage} = require('./utils/messages')
const port = process.env.PORT || 3000

const socketio = require('socket.io')
const http = require('http')
const app = express()
const server = http.createServer(app)
const Filter = require('bad-words')
const  {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
const io = socketio(server)

const publicDirectory = path.join(__dirname,'../public')
app.use(express.static(publicDirectory))

// let message = "Welcome User"

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    socket.on('join',(options,callback)=>{
        // REST OPERATOR
      const {error,user} =  addUser({id:socket.id,...options})
        console.log('error',error)
        console.log('adduser',user)
        if(error) {
          return callback(error)
        }   

        socket.join(user.room)

        //socket.emit , io.emit socket.broadcash.emit
        //io.to.emit == event in a room only
        //socket.broadcast.to.emit===in a room broadcast

        socket.emit('message',generateMessage('Admin','Welcome!'))

        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
  
    })

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('profanity is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
    //    io.emit('message',generateMessage(message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('location',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
       const user = removeUser(socket.id)
       if(user) {
           io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
           io.to(user.room).emit('roomData',{
               room:user.room,
               users:getUsersInRoom(user.room)
           })
       }
        
    })

})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})



    // socket.emit('countUpdated',count)

    // socket.on('increment',()=>{
    //     count++
    //   //  socket.emit('countUpdated',count) 
    //   io.emit('countUpdated',count)
    // })
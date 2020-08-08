const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 5000
const router = require('./router');

app.use(cors());
app.use(router);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
// const publicDirectoryPath = path.join(__dirname, './public')
// app.use(express.static(publicDirectoryPath))

io.on('connection', () => {
    console.log("Connection Established")

    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});




server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
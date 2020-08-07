const users = []

const addUser = function (id,name,room) {
    name = name.trim.toLowerCase()
    room = room.trim.toLowerCase()

    const existingUser = users.find(function (user) {
        return name === user.name && room === user.room
    })

    if((!name) || (!room)){
        return {error: 'Username and Room are required'}
    }

    if(existingUser){
        return {error: 'Username already taken!'}
    }

    const currentUser = {id,name,room}
    users.push(currentUser)

    return {currentUser}
}

const removeUser = function (id) {
    const index = users.findIndex(function (user) {
        return user.id === id
    })

    if (index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = function (id) {

    return users.find(function (user) {
        return user.id === id

    })
}

const getUserInRoom = function (id) {

    return users.filter(function (user) {
        return user.room === room

    })
}

module.exports = {addUser, removeUser, getUser, getUserInRoom}
const users = []

//addUser
const addUser = ({ id, username, room }) => {
    //Clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for exisitn user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'User is in Use!'
        }
    }

    //store
    const user = { id, username, room }
    users.push(user)
    return { user }
}

//removeUser
const removeUser=(id) => {
    // findex stops when match found vs filter
    const index = users.findIndex((user)=>user.id === id)
    if(index !== -1) {
        return users.splice(index,1)[0]
    }
}


const getUser = (id) => {
    return users.find((user)=> user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
// addUser({
//     id:22,
//     username:'Andrew',
//     room:' South Philly'
// })
// addUser({
//     id:42,
//     username:'Mike',
//     room:' South Philly'
// })

// addUser({
//     id:32,
//     username:'Andrew',
//     room:' Center City'
// })

//getUser

// console.log('users',users)
// const userIds = getUser(22)
// console.log('getUser',userIds)

// const userList = getUsersInRoom('south philly')

// console.log('userlist',userList)

// const removedUser = removeUser(22)
// console.log(removedUser)
// console.log(users)






//getUsersInRoom
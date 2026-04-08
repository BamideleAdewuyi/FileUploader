const prisma = require("../lib/prisma.js")

async function createNewUser({ username, password }) {
    const user = await prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })
    return user;
}

module.exports = {
    createNewUser,
}
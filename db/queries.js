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

async function createNewFolder({ userId, title }) {
    const folder = await prisma.folder.create({
        data: {
            title: title,
            authorId: userId
        }
    })
    return folder;
}

async function findUserByUsername({ username }) {
    const user = await prisma.user.findUnique({
        where: { username: username },
    });
    return user;
}

async function findUserById({ id }) {
    const user = await prisma.user.findUnique({
        where: { id: id },
    });
    return user;
}

async function findFolderByTitle({ title }) {
    const folder = await prisma.folder.findUnique({
        where: { title: title }
    });
    return folder;
}

module.exports = {
    createNewUser,
    findUserByUsername,
    findUserById,
    createNewFolder,
    findFolderByTitle,
}
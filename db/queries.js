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

async function createNewFile({ file, userId, folderId }) {
    const newFile = await prisma.file.create({
        data: {
            title: file.originalname,
            filename: file.filename,
            size: file.size,
            url: "URL",
            authorId: userId,
            folderId: folderId
        }
    })
}

async function findUserByUsername({ username }) {
    const user = await prisma.user.findFirst({
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
    const folder = await prisma.folder.findFirst({
        where: { title: title }
    });
    return folder;
}

async function findFolderById({ id }) {
    const folder = await prisma.folder.findUnique({
        where: { id: id }
    });
    return folder;
}

async function findAllUserFolders({ userId }) {
    const folders = await prisma.folder.findMany({
        where: { authorId: userId }
    });
    return folders;
}

async function findAllFolderFiles({ folderId }) {
    const files = await prisma.file.findMany({
        where: { folderId: folderId }
    });
    return files;
}

async function fileExists({ title, userId, folderId }) {
    const file = await prisma.file.findFirst({
        where: { 
            title: title,
            authorId: userId,
            folderId: folderId }
        });
    return file;
}

async function findFileById({ id }) {
    const file = await prisma.file.findUnique({
        where: {
            id: id
        }
    })
    return file;
}

async function folderExists({ userId, title }) {
    const folder = await prisma.folder.findFirst({
        where: { 
            title: title, 
            authorId: userId
        }
    });
    return folder;
}

async function folderBelongsToUser({ userId, folderId }) {
    const folder = await prisma.folder.findFirst({
        where: {
            id: folderId,
            authorId: userId
        }
    });
    return folder;
}

async function fileBelongsToUser({ userId, fileId }) {
    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            authorId: userId
        }
    });
    return file;
}

async function renameFolder({ folderId, title }) {
    const renamedFolder = await prisma.folder.update({
        where: { id: folderId },
        data: { title: title }
    });
}

async function renameFile({ fileId, title }) {
    const renamedFile = await prisma.file.update({
        where: { id: fileId },
        data: { title: title }
    });
}

async function deleteFile({ fileId }) {
    const deletedFile = await prisma.file.delete({
        where: {
            id: fileId
        }
    });
}

async function deleteFolder({ folderId }) {
    const deletedFolder = await prisma.folder.delete({
        where: {
            id: folderId
        }
    });
}

module.exports = {
    createNewUser,
    findUserByUsername,
    findUserById,
    createNewFolder,
    createNewFile,
    findFolderByTitle,
    findFolderById,
    findAllUserFolders,
    findAllFolderFiles,
    fileExists,
    findFileById,
    folderExists,
    folderBelongsToUser,
    fileBelongsToUser,
    renameFolder,
    renameFile,
    deleteFile,
    deleteFolder
}
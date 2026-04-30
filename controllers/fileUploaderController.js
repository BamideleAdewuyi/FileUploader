const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const validateUser = require("../validators/userValidator");
const validateFolder = require("../validators/folderValidator");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const validateFile = require("../validators/fileValidator");
const { folder } = require("../lib/prisma");

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

async function homeGet(req, res) {
  let folders;
  if (req.user) {
    const userId = req.user.id;
    folders = await db.findAllUserFolders({ userId })
  }
    res.render("index", {
      user: req.user,
      folders: folders,
      showForm: "none"
    });
}

async function unauthorisedGet(req, res) {
  res.render("unauthorised")
}

function logInGet(req, res) {
  res.render("logIn")
}

function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  })
}

function signUpGet(req, res) {
  res.render("signUp");
}

async function folderGet(req, res) {
  if (!req.isAuthenticated()) {
    res.render("unauthorised");
    return;
  }
  const folderId = Number(req.params.folderId);
  const userId = Number(req.user.id);
  const folder = await db.findFolderById({ id: folderId });
  const files = await db.findAllFolderFiles({ folderId: folderId });
  if (userId != folder.authorId) {
    res.render("unauthorised");
    return;
  }

  res.render("folder", {
    folder: folder,
    files: files
  })
}

async function fileGet(req, res) {
  if (!req.isAuthenticated()) {
    res.render("unauthorised");
    return;
  }

  const fileId = Number(req.params.fileId);
  const userId = Number(req.user.id);
  const file = await db.findFileById({ id: fileId });
  if (userId != file.authorId) {
    res.render("unauthorised");
    return
  }

  res.render("file", {
    file: file
  })
}

const newUserPost = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUp", {
        errors: errors.array()
      })
    }
    
    const { username, password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.createNewUser({ username, password: hashedPassword });
    res.redirect("/logIn");
  })
]

const newFolderPost = [
  validateFolder,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const userId = req.user.id;
    if (!errors.isEmpty()) {
      folders = await db.findAllUserFolders({ userId });
      return res.status(400).render("index", {
        user: req.user,
        folders: folders,
        errors: errors.array(),
        showForm: "inline-block"
      })
    }

    const { title } = matchedData(req);
    await db.createNewFolder({ userId, title });
    res.redirect("/");
  })
]


const newFilePost = [
    asyncHandler(async (req, res) => {
      const errors = req.errors
      const folderId = Number(req.body.folderId);
      if (errors.length > 0) {
        const path = `./uploads/${req.file.filename}`;
        await fs.promises.unlink(path);
        const folder = await db.findFolderById({ id: folderId });
        const files = await db.findAllFolderFiles({ folderId: folderId });
        return res.status(400).render("folder", {
          folder: folder,
          errors: errors,
          files: files
        })
      }
      const file = req.file;
      const userId = Number(req.user.id);
      await db.createNewFile({ file, userId, folderId });
      res.redirect(`folder/${folderId}`);
    })
]

const renameFolderPost = [
    validateFolder,
    asyncHandler(async (req, res) => {
      if (!req.isAuthenticated()) {
        res.render("unauthorised");
        return;
      }
      const folderId = Number(req.params.folderId);
      const userId = Number(req.user.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const folder = await db.findFolderById({ id: folderId });
        const files = await db.findAllFolderFiles({ folderId: folderId });
        res.render("folder", {
            folder: folder,
            files: files,
            errors: errors.array()
        })
      }
      const { title } = matchedData(req);
      await db.renameFolder({ folderId: folderId, title: title });
      const folder = await db.findFolderById({ id: folderId } );
      const files = await db.findAllFolderFiles({ folderId: folderId });
      res.render("folder", {
        folder: folder,
        files: files
      })
    })
]

module.exports = {
    homeGet,
    logInGet,
    signUpGet,
    logOutGet,
    unauthorisedGet,
    folderGet,
    fileGet,
    newUserPost,
    newFolderPost,
    newFilePost,
    renameFolderPost,
}
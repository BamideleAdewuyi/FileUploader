const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const validateUser = require("../validators/userValidator");
const validateFolder = require("../validators/folderValidator");
const bcrypt = require("bcryptjs");

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
      folders = await db.findAllUserFolders({ userId })
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

module.exports = {
    homeGet,
    logInGet,
    signUpGet,
    logOutGet,
    unauthorisedGet,
    newUserPost,
    newFolderPost
}
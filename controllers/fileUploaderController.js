// need db somehow
const { validationResult, matchedData } = require("express-validator");
const validateUser = require("../validators/userValidator");
const bcrypt = require("bcryptjs");

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

async function homeGet(req, res) {
    res.render("index", {
      user: req.user,
    });
}

module.exports = {
    homeGet
}
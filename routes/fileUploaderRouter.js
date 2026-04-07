const { Router } = require("express");
const fileUploaderController = require("../controllers/fileUploaderController");
const fileUploaderRouter = Router();
// const passport = require("../passport/passport").passport;

// Get
fileUploaderRouter.get("/", fileUploaderController.homeGet);

module.exports = fileUploaderRouter;
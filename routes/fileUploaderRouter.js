const { Router } = require("express");
const fileUploaderController = require("../controllers/fileUploaderController");
const fileUploaderRouter = Router();
// const passport = require("../passport/passport").passport;

// Get
fileUploaderRouter.get("/", fileUploaderController.homeGet);
fileUploaderRouter.get("/logIn", fileUploaderController.logInGet);

module.exports = fileUploaderRouter;
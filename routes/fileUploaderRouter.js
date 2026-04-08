const { Router } = require("express");
const fileUploaderController = require("../controllers/fileUploaderController");
const fileUploaderRouter = Router();
const passport = require("../passport/passport").passport;

// Get
fileUploaderRouter.get("/", fileUploaderController.homeGet);
fileUploaderRouter.get("/logIn", fileUploaderController.logInGet);
fileUploaderRouter.get("/signUp", fileUploaderController.signUpGet);
fileUploaderRouter.get("/logOut", fileUploaderController.logOutGet);

// Post
fileUploaderRouter.post("/signUp", fileUploaderController.newUserPost);
fileUploaderRouter.post(
    "/logIn",
    passport.authenticate("user-local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

module.exports = fileUploaderRouter;
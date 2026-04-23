const { Router } = require("express");
const fileUploaderController = require("../controllers/fileUploaderController");
const fileUploaderRouter = Router();
const passport = require("../passport/passport").passport;
const multer = require('multer');
const upload = require('../validators/fileValidator');

// Get
fileUploaderRouter.get("/", fileUploaderController.homeGet);
fileUploaderRouter.get("/logIn", fileUploaderController.logInGet);
fileUploaderRouter.get("/signUp", fileUploaderController.signUpGet);
fileUploaderRouter.get("/logOut", fileUploaderController.logOutGet);
fileUploaderRouter.get("/folder/:folderId", fileUploaderController.folderGet);

// Post
fileUploaderRouter.post("/signUp", fileUploaderController.newUserPost);
fileUploaderRouter.post("/createFolder", fileUploaderController.newFolderPost);
fileUploaderRouter.post(
    "/logIn",
    passport.authenticate("user-local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

fileUploaderRouter.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    console.log(req.file);
});

fileUploaderRouter.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large. Max size is 5MB' });
        }
    }
    next(error);
});

module.exports = fileUploaderRouter;
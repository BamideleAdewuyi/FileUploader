const db = require("../db/queries");

const lengthErr = "cannot be blank";
const nameErr = 'cannot use \/:*?"<>|';
const nameInUseErr = "Name already in use";
const permissionsErr = "You are not authorised to add to this folder";

const validateFile = [
    async (req, res, next) => {
        if (req.file) {

        }

        if (!req.errors) req.errors = [];
        const title = req.file.originalname.trim();
        if (title.length < 1) {
            req.errors.push(lengthErr);
        }

        const regex = /^[^\\/:*?"<>|]+$/;

        if (!regex.test(title)) {
            req.errors.push(nameErr);
        }

        const userId = Number(req.user.id);
        const folderId = Number(req.body.folderId);
        
        const folderBelongsToUser = await db.folderBelongsToUser({ userId: userId, folderId: folderId });
        if (!folderBelongsToUser) {
            req.errors.push(permissionsErr);
        }

        const fileExists = await db.fileExists({ title: title, userId: userId, folderId: folderId });
        if (fileExists) {
            req.errors.push(nameInUseErr);
        }
        next();
    }
];

module.exports = validateFile;
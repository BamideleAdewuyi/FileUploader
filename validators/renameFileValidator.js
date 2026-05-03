const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "cannot be blank";
const nameErr = 'cannot use \/:*?"<>|';
const nameInUseErr = "Name already in use";

const validateRename = [
    body("title").trim()
        .matches(/^[^\\/:*?"<>|]+$/).withMessage(`Name ${nameErr}`)
        .isLength({ min: 1 }).withMessage(`Name ${lengthErr}`)
        .custom(async (value, { req }) => {
                    const file = await db.fileExists({ 
                        title: value,
                        userId: Number(req.user.id),
                        folderId: Number(req.file.folderId)
                    });
                    if (file) {
                        throw new Error(nameInUseErr);
                    }
                })
];

module.exports = validateRename;
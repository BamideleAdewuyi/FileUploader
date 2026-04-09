const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "cannot be blank";
const nameErr = 'cannot use \/:*?"<>|';
const nameInUseErr = "Name already in use";

const validateFolder = [
    body("title").trim()
        .matches(/^[^\\/:*?"<>|]+$/).withMessage(`Name ${nameErr}`)
        .isLength({ min: 1 }).withMessage(`Name ${lengthErr}`)
        .custom(async value => {
                    const folder = await db.findFolderByTitle({ title: value });
                    if (folder) {
                        throw new Error(nameInUseErr);
                    }
                })
];

module.exports = validateFolder;
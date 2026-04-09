const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "cannot be blank";
const usernameErr = "can only contain letters and numbers";
const passwordErr = "must be 3 characters";
const confirmPasswordErr = "Passwords do not match";
const usernameInUseErr = "Username already in use";

const validateUser = [
    body("username").trim()
        .matches(/^[a-zA-Z0-9]+$/, 'i').withMessage(`Username ${usernameErr}`)
        .isLength({ min: 1 }).withMessage(`First name ${lengthErr}`)
        .custom(async value => {
                    const user = await db.findUserByUsername({ username: value });
                    if (user) {
                        throw new Error(usernameInUseErr);
                    }
                }),
    body("password").trim()
        .isLength({ min: 3 }).withMessage(`Password ${passwordErr}`),
    body("confirmPassword").trim()
        .custom((value, { req }) =>  value === req.body.password).withMessage(confirmPasswordErr)
];

module.exports = validateUser;
const express = require("express");
const path = require("node:path");
const app = express();
const fileUploaderRouter = require("./routes/fileUploaderRouter");
require('dotenv/config');
const passport = require("passport");
const session = require("express-session");
const secret = process.env.SECRET;
const prisma = require("./lib/prisma.js")
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const cloudinary = require("cloudinary").v2;

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: secret, 
        resave: true, 
        saveUninitialized: true,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use("/", fileUploaderRouter);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`App up and running on ${PORT}`)
});
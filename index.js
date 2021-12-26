// imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const nodemailer = require("nodemailer");

// local imports
const User = require("./models/user.model");

const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const MONGODB_URL = process.env.mongoDB_UR || "mongodb+srv://tribe:tribe12345@tribebackend.yruf4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Error...', err);
    process.exit();
});

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({"message": "Server is running :D"});
});

app.post("/api/v1/register", async (req, resp) => {
    console.log("req.ndy", req.body)
    const {userName, email, phone, password} = req.body;

    if (Object.keys(req.body).length === 0) {
        resp.json({
            message: "Provide valid inputs",
            status: false,
        });
    }

    if (userName.length === 0) {
        resp.json({
            message: "Please enter a userName",
            status: false,
        });
    } else if (email.length === 0) {
        resp.json({
            message: "Please enter a valid email",
            status: false,
        });
    } else if (password.length === 0) {
        resp.json({
            message: "Please enter a password",
            status: false,
        });
    } else if (phone.length !== 10) {
        resp.json({
            message: "Please enter a 10 digit phone number",
            status: false,
        });
    } else {
        await User.find({"email": email})
        .then((res) => {
            if (res.length !== 0) {
                resp.json({
                    message: "Email is already in use",
                    status: false,
                });
            } else {
                let newUser = new User(req.body);
                newUser._id = new mongoose.Types.ObjectId();

                newUser.save()
                .then(async() => {

                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'manojsm293@gmail.com',
                            pass: 'syrtolrirnvcxkzo'
                        }
                    });
            
                    await transporter.sendMail({
                        from: '"Team Tribe" <backend@teamtribe.com>',
                        to: email,
                        subject: "Welcome Message",
                        text: "Welcome to Tribe Backend",
                    });

                    resp.json({
                        message: "EUser registed successfully",
                        status: true,
                    });
                })
                .catch(() => {
                    resp.json({
                        message: "User registration failed",
                        status: false,
                    });
                })
            }
        })
    }

});

app.post("/api/v1/sendEmail", async (req, resp) => {
    const {email} = req.body;

    if (Object.keys(req.body).length === 0) {
        resp.json({
            message: "Provide valid inputs",
            status: false,
        });
    } else if (email.length === 0) {
        resp.json({
            message: "Enter a valid email",
            status: false,
        });
    } else {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'manojsm293@gmail.com',
                pass: 'syrtolrirnvcxkzo'
            }
        });

        const messageiInfo = await transporter.sendMail({
            from: '"Team Tribe" <backend@teamtribe.com>',
            to: email,
            subject: "Welcome Message",
            text: "Welcome to Tribe Backend",
        });

        if (messageiInfo.messageId) {
            resp.json({
                message: "Email sent successfully",
                status: true,
            });
        } else {
            resp.json({
                message: "Could not send email",
                status: false,
            });
        }
    }

})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
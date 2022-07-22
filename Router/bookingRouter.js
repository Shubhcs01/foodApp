const express = require('express');
const {protectRoute} = require('../controller/authController')
const {createSession} = require('../controller/bookingController')
const path = require("path");

const bookingRouter = express.Router()

bookingRouter.post('/createSession', protectRoute, createSession)
bookingRouter.get('/createSession', (req,res)=>{
    res.sendFile("booking.html", { root: path.join(__dirname, "../public") });
})

module.exports = bookingRouter;
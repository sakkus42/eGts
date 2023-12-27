const { model } = require("mongoose");
const nodemailer = require("nodemailer");
const path = require('path');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASWORDMAIL,
  },
});


module.exports = transporter




const express = require("express");
const app = express();
const mainRouter = require("./router/mainRouter.js")
const userRouter = require("./router/userRouter.js")
const productRouter = require("./router/productRouter.js")
const adminRouter = require("./router/adminRouter.js")
const con = require("./config.js");
const Product = require("./model/Product.js");
const PORT = 3001;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');
const session = require("express-session");


require("dotenv").config();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
  secret: "7Gb3Mkcj4A-",
  resave: false,
  saveUninitialized: false,
}));
app.use((req, res, next) => {
  if (!req.session.basket){
    req.session.basket = [];
  }
  next();
});
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser())

app.use('/user', userRouter);
// app.use('/product', productRouter);
app.use('/admin', adminRouter);
app.use('/', mainRouter);

app.listen(PORT, (req, res) => {
    console.log(`Listen ${PORT} server`);
});

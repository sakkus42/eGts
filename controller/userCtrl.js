const jwt  = require('jsonwebtoken');
const User = require('../model/User.js');
const createToken = require('../middleWare/token.js');
const transporter  = require('../middleWare/mail.js');
require('dotenv').config();
const regex = /['`"%\\]/;

const createUser = async (req, res, next) => {
    const reqUser = {
        email: req.body.email, 
        phone: req.body.phone,
        name: req.body.name,
        sirname: req.body.sirname,
        psw: req.body.psw
    }

    const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneregex = /^(\+90|0)?\s*(\(\d{3}\)[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}|\(\d{3}\)[\s-]*\d{3}[\s-]*\d{4}|\(\d{3}\)[\s-]*\d{7}|\d{3}[\s-]*\d{3}[\s-]*\d{4}|\d{3}[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2})$/;
    if (!emailRegexp.test(req.body.email)) {
        res.render('user', 
        {
            errorE: 'Geçersiz e-posta',
            user: reqUser,
        });
        return;
    }
    if (!phoneregex.test(req.body.phone)){
        console.log("sealmssszz");
        res.render('user', 
        {
            errorP: 'Geçersiz telefon',
            user: reqUser,
        });
        return;
    }
    for (const key in reqUser) {
        if (Object.hasOwnProperty.call(reqUser, key)) {
            const value = reqUser[key];
            if (regex.test(value)) {
                console.log("selammssssszz");
                res.render('user', 
                {
                    user: reqUser 
                });
                return;
            }
        }
    }
    const [email, _] = await User.findByMail(req.body.email)
    const [phone, _1] = await User.findByPhone(req.body.phone)
    if (email.length != 0 && phone.length != 0){
        res.render("user",
        {
            errorE: "Bu e-posta hali hazırda kullanılıyor", 
            errorP: "Bu telefon numarasına sahip kullanıcı zaten kayıtlı",
            user: reqUser
        });
        return;
    }else if (phone.length != 0){
        res.render("user", {errorP: "Bu telefon numarasına sahip kullanıcı zaten kayıtlı", user: reqUser});
        return;
    }else if (email.length != 0){
        console.log("selam");
        res.render("user", {errorE: "Bu e-posta hali hazırda kullanılıyor", user: reqUser});
        return;
    }
    let user = new User(
        req.body.email, 
        req.body.phone,
        req.body.name,
        req.body.sirname,
    );
    await user.setPassword(req.body.psw);
    await user.save();
    const [savedUser] = await User.findByMail(user.email);
    res.locals.id = savedUser[0].id;
    next();
};

const login = async (req, res, next) => {
    let {email, psw} = req.body;
    if (regex.test(email)){
        res.render('user', {message: "hatalı şifre yada e-posta!"});
        return;
    }
    let [user, _] = await User.findByMail(email);
    if (user.length == 0){
        res.render("user", { message: "hatalı şifre yada e-posta!" });
        return;
    }
    if(user.length === 0 || await User.validateUser(user[0].psw, psw) === false){
        res.locals.userErr = true;
        res.render("user", {message: "hatalı şifre yada e-posta!"});
        return;
    }
    if (user[0].confirmEmail == 0) {
        res.locals.userErr = true;
        res.render("user", {message: "Lütfe e-posta adresinize gelen maili onaylayınız."});
        return;
    }
    if (user[0].isBlocked == 1){
        res.redirect("/");
        return;
    }
    const token = createToken(user[0].id);
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000*60*60*24
    }).jwt;
    res.redirect("/");
};

const logout = async (req, res) => {
    console.log("selam");
    res.clearCookie('jwt');
    res.redirect("/")
};



const updateUser = async (req, res, next) => {
    let user = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (key != "psw" && regex.test(value)){
            next();
            return;
        }
        if (value && key != "psw"){
            user[key] = value;
        }
        if (key == "psw" && value != ""){
            console.log(value);
            user[key] = await User.bcryptCrt(value);
        }
    }
    
    if (Object.keys(user).length !== 0){
        await User.update(res.locals.user.id, user);
    }
    next();
};

const isAdmin = async (req, res, next) => {
    if (res.locals.user.isAdmin){
        next();
        return;
    }
    res.redirect("/");
};

const allUser = async (req, res, next) => {
    const [users, _] = await User.getAllUser();
    const resUser = users.filter(el => !el.isAdmin);
    res.locals.users = resUser;
    
    next();
}

const blocked = async (req, res) => {
    const {id} = req.params;
    const [user, _] = await User.findById(id);
    await User.update(id, {
        isBlocked: user[0].isBlocked ? 0 : 1,
    });
    res.json({isBlocked : user[0].isBlocked ? 0 : 1});
};

const delUser = async (req, res) => {
    const {id} = req.params;
    const [user] = await User.findById(id);
    if (user.length != 0){
        User.delById(id);
    }
    res.end();
    return;
};

const confirmMail = async (req, res) => {
    res.render('welcome-mail', { path: `http://192.168.1.3:3001/user/${res.locals.id}`,imgPath: __dirname + '/../views/images/logo.png'}, function(err, html){ 
        if (err) {
            console.log('error rendering email template:', err) 
            return
        } else {
            var mailOptions = {
                from: process.env.MAIL,
                to : req.body.email,
                subject: 'Mail Onayı Bekleniyor',
                generateTextFromHtml : true,
                html: html,
                attachments: [{
                  filename: 'logo.png',
                  path: __dirname + '/../views/images/logo.png',
                  cid: 'logo'
              }],
            };
      
            transporter.sendMail(mailOptions, function(error, response){
                if(error) {
                    console.log(error);
                    res.send('Mail Error! Try again')
                } else {
                    console.log('Mail Yollama işlemi çalıştı');
                    res.render('user', { confirm: "E-posta adresinize gelen mailden onaylama işlemini yapabilirsiniz." })
                }
            });
          } 
        });    
} ;


module.exports = {
    createUser,
    login,
    logout,
    updateUser,
    isAdmin,
    allUser,
    blocked,
    delUser,
    confirmMail,
}
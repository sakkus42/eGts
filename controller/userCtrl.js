const jwt  = require('jsonwebtoken');
const User = require('../model/User.js');
const createToken = require('../middleWare/token.js');

const createUser = async (req, res) => {
    const [email, _] = await User.findByMail(req.body.email)
    const [phone, _1] = await User.findByPhone(req.body.phone)
    const reqUser = {
        email: req.body.email, 
        phone: req.body.phone,
        name: req.body.name,
        sirname: req.body.sirname,
        psw: req.body.psw
    }
    console.log(email.length);
    console.log(phone.length);
    if (email.length != 0 && phone.length != 0){
        res.render("user",
        {
            errorE: "email", 
            errorP: "phone",
            user: reqUser
        });
        return;
    }else if (phone.length != 0){
        res.render("user", {errorP: "phone", user: reqUser});
        return;
    }else if (email.length != 0){
        console.log("selam");
        res.render("user", {errorE: "email", user: reqUser});
        return;
    }
    let user = new User(
        req.body.email, 
        req.body.phone,
        req.body.name,
        req.body.sirname,
    );
    await user.setPassword(req.body.psw[0]);
    await user.save();
    res.redirect("/");
};

const login = async (req, res, next) => {
    let {email, psw} = req.body;
    let [user, _] = await User.findByMail(email);
    if (user.length == 0){
        console.log("selam");
        res.render("user", { message: "hata" });
        return;
    }
    if(user.length === 0 || await User.validateUser(user[0].psw, psw) === false){
        console.log("hatalı şifre yada e-posta");
        res.locals.userErr = true;
        res.render("user", {message: "selam"});
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
    });
    res.redirect("/");
};

const logout = async (req, res) => {
    console.log("selam")
    res.clearCookie('jwt');
    res.redirect("/")
};



const updateUser = async (req, res, next) => {
    let user = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (value && key != "psw"){
            user[key] = value;
        }
        if (key == "psw" && value[0] != ""){
            user[key] = await User.bcryptCrt(value[0]);
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
    console.log(res.locals.users);
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


module.exports = {
    createUser,
    login,
    logout,
    updateUser,
    isAdmin,
    allUser,
    blocked,
}
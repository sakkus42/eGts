const express = require("express");
const router = express.Router();
const { createUser, login, logout, updateUser, confirmMail } = require("../controller/userCtrl");
const { authenticateToken, authCtrl } = require("../middleWare/authMiddleware");
const User = require("../model/User");
const jwt  = require('jsonwebtoken');

router.use(express.static('views'));

router.post("/login", login);

router.post("/register", createUser, confirmMail);

router.get("/profile", authenticateToken, authCtrl, (req, res) => {
    res.render("profil", {isLog: res.locals.isLog, user: res.locals.user});
});

router.post("/update", authenticateToken ,authCtrl, updateUser, (req, res) => {
    res.redirect("profile")
});


router.get("/logout", authenticateToken, logout);

router.get("/", (req, res) => {
    res.render("user", {islog: "selam"});
})

router.get("/:id", async (req, res) => {
    const [user] = await User.findById(req.params.id);
    if (user.length != 0){
        await User.update(user[0].id, {confirmEmail: 1});
        res.render("user", { confirm: 'E-posta adresiniz onaylanmıştır giriş yapabilirsiniz.' });
        return;
    }else {
        console.log('yanlış');
        res.redirect("/");
    };
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { createUser, login, logout, updateUser, isAdmin, allUser, blocked } = require("../controller/userCtrl");
const { authenticateToken, authCtrl } = require("../middleWare/authMiddleware");

router.use(express.static('views'));

router.post("/login", login);

router.post("/register", createUser, login);

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

module.exports = router;
const express = require("express");
const router = express.Router();
const { isAdmin } = require("../controller/userCtrl");
const { authenticateToken, authCtrl } = require("../middleWare/authMiddleware");
const { createProduct, getAllProducts, delProduct } = require("../controller/productCtrl");

router.get("/getCategory", authCtrl, isAdmin, (req, res) => {
    res.json({category: [
        "akıllı saatler",
        "kulaklık",
        "aksesuar",
    ]})
});

module.exports = router;
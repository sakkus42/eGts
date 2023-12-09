const express = require("express");
const router = express.Router();
const { isAdmin, allUser, blocked } = require("../controller/userCtrl");
const { authenticateToken, authCtrl } = require("../middleWare/authMiddleware");
const { 
    getAllProducts,
    delProduct,
    createProduct,
    updateProduct,
    campaignUpdate,
    deleteImage,
    addImport,
} = require("../controller/productCtrl");
const { upload, singleUpload } = require("../middleWare/multerMiddlware");
const Product = require("../model/Product");
const Carrousel  = require("../model/Carrousel");
const { createCarrousel, deleteCarrousel } = require("../controller/carrouselCtrl");

router.use(express.static('views'));


router.post("/creatCarrousel", authCtrl, isAdmin, createCarrousel);

router.post("/creatProduct", authCtrl, isAdmin, createProduct);

router.post("/product/update/:id", authCtrl, isAdmin, updateProduct)

router.post("/uploadImg/:id", authCtrl, isAdmin, async (req, res) => {
    upload(req, res, async (err) => {
        if (!err && req.files != ""){
            res.status(200).send();
        } else if (!err && req.files == ""){
            res.statusMessage = "Fotoğraf seçimi yapınız"
            res.status(400).end();
        } else{
            res.statusMessage = err
            res.status(400).end();
        }
        const { id } = req.params;
        let files = Array.from(req.files).map((file, index) => ({
            index: index,
            path: file.path,
            fileName: file.filename
        }));
        const [product, _] = await Product.findById(id);
        const oldImg = product[0].images;
        console.log(oldImg)
        if (oldImg) files = oldImg.concat(files);
        Product.saveImage(id, JSON.stringify(files));
    });
    console.log("selam")
    res.redirect("/admin/products");
})

router.post("/campaign/:id", authenticateToken, authCtrl, isAdmin, campaignUpdate);


router.get("/carrousel", authCtrl, isAdmin, async (req, res) => {
    const [all, _] = await Carrousel.getAll();
    console.log(all);
    res.render('carrouselMaker', {all : all});
});

router.get("/updateImg/:id", authCtrl, isAdmin, async (req, res) => {
    const [product, _] = await Product.findById(req.params.id);
    
    res.render("productImage", {photo: true, image: product[0].images, id: req.params.id});
});
router.get("/search/:title", authenticateToken, authCtrl, isAdmin, async (req, res) => {
    const [prdct, _] = await Product.findByTitle(req.params.title);
    if (prdct.length == 0){
        res.json({ prdct: null })
        return;
    }
    console.log(prdct);
    res.json({prdct: prdct[0]});
});

router.put("/import/:id", authenticateToken, authCtrl, isAdmin, addImport);
router.put("/delCarrousel/:id", authenticateToken, authCtrl, isAdmin, deleteCarrousel);
router.put("/delImg/:id", authenticateToken, authCtrl, isAdmin, deleteImage);
router.put("/block/:id", authenticateToken, authCtrl, isAdmin, blocked);
router.put("/del/:id", authenticateToken, authCtrl, isAdmin, delProduct);


router.get("/prdctMaker", authenticateToken, authCtrl, isAdmin, (req, res) => {
    res.render("productMaker", {photo: false});
});

router.get("/product/:slug", authenticateToken, authCtrl, isAdmin, async (req, res) => {
    const slug = req.params.slug;
    const [prdct, _] = await Product.findBySlug(slug);
    console.log(prdct[0]);
    res.render("productUpdate", { prdct: prdct[0] });
});

router.get("/campaign/:slug", authenticateToken, authCtrl, isAdmin, async (req, res) => {
    const slug = req.params.slug;
    const [prdct, _] = await Product.findBySlug(slug);
    res.render("productCampaign", { prdct: prdct[0] });
});



router.get("/products", authenticateToken, authCtrl, isAdmin, getAllProducts)

router.get("/members", authenticateToken, authCtrl, isAdmin, allUser, (req, res) => {
    console.log(res.locals.users[0]);
    res.render("members", { users: res.locals.users });
});

router.get("/", authenticateToken, authCtrl, isAdmin, (req, res) => {
    res.render("admin");
});




module.exports = router;
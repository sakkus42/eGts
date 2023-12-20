const express = require("express");
const router = express.Router();

const User = require("../model/User");
const { authenticateToken, authCtrl } = require("../middleWare/authMiddleware");
const {searchProduct} = require("../controller/productCtrl");
const Product = require("../model/Product");
const { getAll } = require("../model/Carrousel");
const Carrousel = require("../model/Carrousel");
const { cntrlOptions } = require("../controller/options");


const data = {};

data.arrayCatalog = [];

data.prdcts = [];

data.head = []

data.basket = data.prdcts.slice(0, 5);

data.sizeC = data.arrayCatalog.length;



router.post("/addBasket", (req, res) => {
    let {id, price, image, title, oldPrice, count, color, giftContent, options, prices, newId, slug} = req.body;
    console.log(req.body.image)
    if (options && options[0] !== 'undefined'){
        options = String(options).split(",");
        prices = String(prices).split(",").map(Number);
    }

    const basket = req.session.basket;
    if (typeof count !== 'undefined' && typeof count !== 'number') { count = Number(count); }
    let found = false;
    for (let i = 0; i < basket.length; i++){
        console.log(cntrlOptions(basket[i].options, options).length)
        if (basket[i].title != title){
            continue;
        }else if (typeof basket[i].newId == 'undefined' && cntrlOptions(basket[i].options, options).length){
            break;
        }else if (basket[i].newId == newId || !cntrlOptions(basket[i].options, options).length){
            basket[i].count += count;
            if (!basket[i].count) basket.slice(i, 1);
            found = true;
            console.log("selam")
            break;
        }

    }
    if (!found) {
        basket.push({
            id,
            image, 
            title,
            color,
            giftContent,
            options,
            prices,
            slug,
            newId: "id" + Math.random().toString(16).slice(2),
            price: Number(price), 
            oldPrice: Number(oldPrice), 
            index: basket.length, 
            count: 1,
        });
    }
    req.session.basket = basket.filter((el) => el.count != 0);
    res.redirect("/basket");
});

router.get("/basket", authCtrl, async (req, res) => {
    const basket = req.session.basket;
    const total = basket.reduce((total, item) => {
        return total + (item.price * item.count);
    }, 0);
    const [imported] = await Product.getAllImportProduct();
    res.render("basket-shop", { 
        data: basket,
        total: total,
        imported,
        isLog: res.locals.isLog
    });
});


router.post("/search", authCtrl, searchProduct);
router.get("/accessuar", authCtrl, async (req, res) => {
    const [accessuar] = await Product.getAllProductByCategory("aksesuar");
    res.render("accessuar",  {accessuar: accessuar.reverse(), isLog: res.locals.isLog});
});

router.get("/headset", authCtrl, async (req, res) => {
    const [headset] = await Product.getAllProductByCategory("kulaklık");
    res.render("headset",  {data: headset.reverse(), isLog: res.locals.isLog});
});

router.get("/watches", authCtrl, async (req, res) => {
    console.log("selam2")
    const [products, _] = await Product.getAllProductByCategory("akıllı saat");
    console.log(products);
    res.render("watches",  {products: products.reverse()});
});

router.get("/", authCtrl, async (req, res) => {
    const [watches] = await Product.getAllProductByCategory("akıllı saat");
    const [accessuar] = await Product.getAllProductByCategory("aksesuar");
    const [head] = await Product.getAllProductByCategory("kulaklık");
    const [imported] = await Product.getAllImportProduct();
    const [carrousel] = await Carrousel.getAll()
    res.render("index",  {
        data: data,
        carrousel: carrousel,
        watches: watches.reverse(),
        accessuar:accessuar.reverse(),
        head: head.reverse(),
        imported:imported,
        isLog: res.locals.isLog
    });
});

router.get("/:slug", authCtrl, async (req, res) => {
    const [product, _] = await Product.findBySlug(req.params.slug);
    if (product.length == 0){
        res.redirect("/");
        return;
    }
    const [products] = await Product.getAllImportAndCategoryProduct(product[0].category, 1, [product[0].slug]);
    if (products.length < 4){
        console.log("burdayızz beybisi");
        let slug = products.map(el => el.slug)
        slug.push(product[0].slug);
        const [pr] = await Product.getAllImportAndCategoryProduct(product[0].category, 0, slug);
        console.log(pr);
        for (let i = 0; products.length < 4 && i < pr.length; i++){
            console.log(slug)
            products.push(pr[i]);
        }
    };
    res.render("product-details", {data: product[0], imported: products} );
});

module.exports = router;
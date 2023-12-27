const express = require("express");
const router = express.Router();


const { authenticateToken, authCtrl } = require("../middleWare/authMiddleware");
const {searchProduct} = require("../controller/productCtrl");
const Product = require("../model/Product");
const Carrousel = require("../model/Carrousel");
const { cntrlOptions } = require("../controller/options");
const { creatOrder } = require("../controller/orederlistCntrl");






router.post("/addBasket", (req, res) => {
    let {id, price, image, title, oldPrice, count, color, giftContent, options, prices, newId, slug} = req.body;
    if (options && options[0] !== 'undefined'){
        options = String(options).split(",");
        prices = String(prices).split(",").map(Number);
    }
    const basket = req.session.basket;
    
    if (typeof count !== 'undefined' && typeof count !== 'number') { console.log(count); count = Number(count); }
    let found = false;
    console.log(newId)
    for (let i = 0; i < basket.length; i++){

        if (basket[i].title != title){
            continue;
        }else if (typeof newId == 'undefined' && cntrlOptions(basket[i].options, options).length){
            continue;
        }else if (typeof newId != 'undefined' && newId != basket[i].newId) {
            continue;
        }else if (typeof color != 'undefined' && basket[i].color != color){
            continue;
        }
        basket[i].count += count;
        if (!basket[i].count) basket.slice(i, 1);
        found = true;
        break;
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
    const totalDisc = basket.reduce((total, item) => {
        return total + (item.oldPrice * item.count);
    }, 0);
    const totalOp = basket.reduce((total, item) => {
        return total + item.prices.reduce((total, item) => { return total + item }, 0) * item.count;
    }, 0);
    const [imported] = await Product.getAllImportProduct();
    res.render("basket-shop", { 
        data: basket,
        total: total,
        imported,
        totalDisc,
        totalOp,
        isLog: res.locals.isLog
    });
});
  



router.post("/deneme", authCtrl, creatOrder);

router.post("/search", authCtrl, searchProduct);
router.get("/aksesuar", authCtrl, async (req, res) => {
    const [accessuar] = await Product.getAllProductByCategoryIsQuantity("aksesuar");
    res.render("accessuar",  {accessuar: accessuar.reverse(), isLog: res.locals.isLog});
});

router.get("/kulaklik", authCtrl, async (req, res) => {
    const [headset] = await Product.getAllProductByCategoryIsQuantity("kulaklık");
    res.render("headset",  {data: headset.reverse(), isLog: res.locals.isLog});
});

router.get("/akilli-saat", authCtrl, async (req, res) => {
    const [products, _] = await Product.getAllProductByCategoryIsQuantity("akıllı saat");
    console.log(products);
    res.render("watches",  {products: products.reverse()});
});

router.get("/odeme", authCtrl, async (req, res) => {
    const user = res.locals.isLog ? res.locals.user : [];
    const basket = req.session.basket;
    if (basket.length == 0){
        res.redirect("/");
        return;
    }
    const total = basket.reduce((total, item) => {
        return total + (item.price * item.count);
    }, 0);
    const totalDisc = basket.reduce((total, item) => {
        return total + (item.oldPrice * item.count);
    }, 0);
    const totalOp = basket.reduce((total, item) => {
        return total + item.prices.reduce((total, item) => { return total + item }, 0) * item.count;
    }, 0);
    res.render('pay', { user, data: basket, total: total, totalOp, totalDisc, note: req.body.note});
});

router.get("/odeme-onay", authCtrl, async (req, res) => {
    res.render("pay-accept", { ok: true, isLog: res.locals.isLog });
})
router.get("/", authCtrl, async (req, res) => {
    const [watches] = await Product.getAllProductByCategory("akıllı saat");
    const [accessuar] = await Product.getAllProductByCategory("aksesuar");
    const [head] = await Product.getAllProductByCategory("kulaklık");
    const [imported] = await Product.getAllImportProduct();
    const [carrousel] = await Carrousel.getAll()
    res.render("index",  {
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
const upload  = require("../middleWare/multerMiddlware");
const slugify  = require("slugify");
const Product = require("../model/Product");
const fs = require('fs');

const createProduct = async (req, res, next) => {
    const [findProduct, _] = await Product.findByTitle(req.body.title);
    if (findProduct.length != 0){
        res.redirect("/admin/products")
        return;
    }
    const product = new Product(req.body);
    await product.save();
    const [saveprdct, _1] = await Product.findByTitle(req.body.title);
    res.render("productImage", {photo: true, image: null, id: saveprdct[0].id});
}

const getAllProducts = async (req, res) => {
    const [products, _] = await Product.getAllProduct();
    res.render("products", { products });
}

const delProduct = async (req, res) => {
    const {id} = req.params;
    const [product, _] = await Product.findById(id);
    product[0].images.some((image )=> {
        const fs = require('fs');
        if (fs.existsSync('dosya_yolu')) {
            fs.unlinkSync('dosya_yolu');
        } else {
            console.log('Dosya bulunamadı.');
        }
    })
    Product.delById(id);
    res.json();
};

const deleteImage = async (req, res) => {
    const {id} = req.params;
    const [product, _] = await Product.findById(id);
    const images = product[0].images;
    const delImages = req.body;
    const remainingImages = images.filter(image => {
        return !delImages.some(delImage => delImage.fileName === image.fileName);
    });
    delImages.some(delImage => fs.unlinkSync(`./views/images/product/${delImage.fileName}`))
    
    Product.saveImage(id, JSON.stringify(remainingImages));
};

function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const [oldProduct, _] = await Product.findById(id);
    let prdct = {};
    let color = [];
    for (const [key, value] of Object.entries(req.body)) {
        if (value && key != 'array' && key != 'discont'){
            prdct[key] = value;
        }else if (value && key == 'array'){
            color = value;
        }
    }
    if (color.length !== oldProduct[0].color.length){
        prdct['color'] = JSON.stringify( color )
    }
    if (Object.keys(prdct).length !== 0){
        await Product.update(id ,prdct);
    }
    res.redirect(`/admin/products`)
};

const campaignUpdate = async (req, res) => {
    const { id } = req.params;
    const [oldProduct, _] = await Product.findById(id);
    let prdct = {};
    let options = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (value && key != 'discont' && key != 'giftCategory' && key != 'options'  && key != 'optionPrice'){
            prdct[key] = value;
        }else if (value && key == 'discont'){
            prdct[key] = value;
            prdct['oldPrice'] = oldProduct[0].price;
            prdct['price'] =  oldProduct[0].price - Math.round((value / 100) * oldProduct[0].price);
        }else if (value && key == 'giftCategory'){
            prdct[key] = slugify(value);
        }else if (value && (key == 'options' ||  key == 'optionPrice')){
            options[key] = value;
            if (key == 'optionPrice'){
                prdct['options'] = JSON.stringify({
                    option: options['options'],
                    price: options['optionPrice'],
                });
            }
        
        }
    }
    if (Object.keys(prdct).length !== 0) {
        await Product.update(id, prdct);
    }
    res.redirect('/admin/products');
}

const addImport = async (req, res) => {
    const {id} = req.params;
    const [product] = await Product.findById(id);

    await Product.update(id, {
        import: product[0].import == 0 ? 1 : 0,
    });
    res.end();
}

const searchProduct = async (req, res) => {
    const searchKey  = req.body.searchKey.trim();
    const regex = /['`"%\\]/
    if (regex.test(searchKey)){
        res.render('ara', {data: []})
        return;
    }
    const [categoryPrdcts] = await Product.getAllProductByCategory(searchKey);
    const [titlePrdcts] = await Product.findByTitle(searchKey);
    const [brandPrdcts] = await Product.getAllBrand(searchKey);
    const [isTitlePrdct] = await Product.getAllKeyTitle(searchKey);
    let prdcts = categoryPrdcts.concat(titlePrdcts).concat(brandPrdcts).concat(isTitlePrdct);
    const ids = [];
    prdcts = prdcts.filter(data => {
        if (!ids.includes(data.id)) {
            ids.push(data.id);
            return true;
        }
        return false;
    });

    res.render('ara', { data: prdcts });
}

module.exports = {
    createProduct,
    getAllProducts,
    delProduct,
    updateProduct,
    campaignUpdate,
    deleteImage,
    addImport,
    searchProduct,
};
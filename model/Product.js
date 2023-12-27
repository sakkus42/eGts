const { default: slugify } = require('slugify');
const db = require('../config.js');

class Product {
    constructor (body){
        this.title = body.title;
        this.slug = slugify(body.title);
        this.description = body.description;
        this.price = body.price;
        this.category = body.category;
        this.brand = body.brand;
        this.brandSlug = slugify(body.brand);
        this.quantity = body.quantity;
        this.color = JSON.stringify(body.array);
        this.images;
    }

    async   save(){
        const sql = `INSERT INTO products(
            title,
            slug,
            description,
            price,
            category,
            brand,
            brandSlug,
            quantity,
            color
            )
            VALUES(
            '${this.title}',
            '${this.slug}',
            "${this.description}",
            '${this.price}',
            '${this.category}',
            '${this.brand}',
            '${this.brandSlug}',
            '${this.quantity}',
            '${this.color}');`;
        return db.execute(sql);
    };

    static async saveImage(id, files){
        const sql = `UPDATE products SET images = '${files}' WHERE id = '${id}'`;
        return db.execute(sql);
    }

    static async update(id, updatedData){
        let updateQuery = 'UPDATE products SET ';

        const updateValues = [];
        for (const key in updatedData) {
            if (Object.hasOwnProperty.call(updatedData, key)){
                console.log(Object.hasOwnProperty.call(updatedData, key));
                updateValues.push(`${key} = '${updatedData[key]}'`);
            }
        }
        console.log(updateValues);
        
        updateQuery += updateValues.join(', '); 
        updateQuery += ` WHERE id = ${id};`;
        return await db.execute(updateQuery)
           .then(res => {
            return res;
           })
           .catch(err => {
            console.log(err);
            return err.code;
           })
    };

    static delById(id) {
        const sql = `DELETE FROM products WHERE id = '${id}'`
        return db.execute(sql);
    }

    static findByTitle(title) {
        const sql = `SELECT * FROM products WHERE title = '${title}'`
        return db.execute(sql);
    };

    static findBySlug(slug) {
        const sql = `SELECT * FROM products WHERE slug = '${slug}'`
        return db.execute(sql);
    };

    static findById(id) {
        const sql = `SELECT * FROM products WHERE id = '${id}'`
        return db.execute(sql);
    };

    static getAllProduct(){
        const sql = `SELECT * FROM products`;
        return db.execute(sql);
    }

    static getAllProductByCategory(category){
        const sql = `SELECT * FROM products WHERE category = '${category}'`;
        return db.execute(sql);
    }

    static getAllProductByCategoryIsQuantity(category){
        const sql = `SELECT * FROM products WHERE category = '${category}' AND quantity != 0`;
        return db.execute(sql);
    }

    static getAllImportProduct(){
        const sql = `SELECT * FROM products WHERE import = 1`;
        return db.execute(sql);
    }

    static getAllImportAndCategoryProduct(category, importFlag, slug){
        const excludedSlugsString = slug.map(slug => `'${slug}'`).join(', ');
        const sql = `SELECT * FROM products WHERE import = ${importFlag} AND category = "${category}" AND slug NOT IN (${excludedSlugsString})`;
        console.log(sql);
        return db.execute(sql);
    }

    static getAllBrand(model) {
        const sql = `SELECT * FROM products WHERE brand = "${model}"`;
        return db.execute(sql);
    }

    static getAllKeyTitle(title) {
        const sql = `SELECT * FROM products WHERE title LIKE '%${title}%'`;
        return db.execute(sql);
    }

};

module.exports = Product;
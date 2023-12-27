const { default: slugify } = require('slugify');
const db = require('../config.js');

class Carrousel {
    constructor(body){
        this.title = body.title;
        this.content = body.content;
        this.image = JSON.stringify(body.file);
        this.href = body.href;
    }

    async save(){
        const sql = `INSERT INTO carrousel(
            title,
            content,
            images,
            href
            )
            VALUES(
                '${this.title}',
                "${this.content}",
                '${this.image}',
                '${this.href}'
            )
            `;
        return db.execute(sql);
    };

    saveImg(image) { this.image = image; }

    static getAll(){
        const sql = "SELECT * FROM carrousel";
        return db.execute(sql);
    }
    
};

module.exports = Carrousel;
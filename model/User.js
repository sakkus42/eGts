const db = require('../config.js');
const bcrypt = require('bcrypt');

class User {
    constructor(email, phone, name, sirname, address = null){
        this.email = email;
        this.phone = phone;
        this.name = name;
        this.sirname = sirname;
        this.address = address;
        this.confirmEmail = 0;
    }

    async setPassword(password){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        this.password = hash;
    };

    
    async save() {
        const sql = `INSERT INTO user(
                    email,
                    phone,
                    name,
                    sirname,
                    psw,
                    address,
                    confirmEmail
                    )
                    VALUES(
                    '${this.email}',
                    '${this.phone}',
                    '${this.name}',
                    '${this.sirname}',
                    '${this.password}',
                    '${this.address}',
                    '${this.confirmEmail}'
                    );`;
        const [newUser, _] = await db.execute(sql);
        return (newUser);
    }
    
    // static funcs
            
    static findAll(){
        const sql = "SELECT * FROM user";
        return db.execute(sql);
    }

    static async update(id, updatedData){
        let updateQuery = 'UPDATE user SET ';

        const updateValues = [];
        for (const key in updatedData) {
            if (Object.hasOwnProperty.call(updatedData, key)) {
            updateValues.push(`${key} = '${updatedData[key]}'`);
            }
        }
        
        updateQuery += updateValues.join(', '); 
        updateQuery += ` WHERE id = ${id};`;
        return await db.execute(updateQuery)
           .then(res => {
            return res;
           })
           .catch(err => {
            console.log(err);
            return false;
           })
    }
    
    static findByMail(email) {
        const sql = `SELECT * FROM user WHERE email = '${email}';`
        return db.execute(sql);
    }

    static findByPhone(phone) {
        const sql = `SELECT * FROM user WHERE phone = '${phone}';`
        return db.execute(sql);
    }

    static findById(id) {
        const sql = `SELECT * FROM user WHERE id = '${id}';`
        return db.execute(sql);
    }

    static getAllUser() {
        const sql = `SELECT * FROM user;`
        return db.execute(sql);
    }
    
    static async validateUser(hash, password){
        return  await bcrypt.compare(password, hash)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log(err.message)
                    return false;
                })
    }
    static async bcryptCrt(password){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static delById(id) {
        const sql = `DELETE FROM user WHERE id = '${id}'`
        db.execute(sql);
    }

}

module.exports = User;
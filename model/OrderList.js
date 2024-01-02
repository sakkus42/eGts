const db = require('../config.js');


class OrderList {
    constructor (body){
         this.productData = JSON.stringify(body.productData);
         this.totalPrice = body.totalPrice;
         this.userId = body.userId;
         this.email = body.email;
         this.phone = body.phone;
         this.name = body.name;
         this.sirname = body.sirname;
         this.address = body.address;
         this.note = body.note;
    }

    async save() {
        const sql = `INSERT INTO orderlist (
            productData,
            totalPrice,
            userID,
            email,
            phone,
            name,
            sirname,
            address,
            note
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            this.productData,
            this.totalPrice,
            this.userId,
            this.email,
            this.phone,
            this.name,
            this.sirname,
            this.address,
            this.note
        ];

        return db.execute(sql, values);

    }

    static delById(id) {
        const sql = `DELETE FROM orderlist WHERE id = '${id}'`
        return db.execute(sql);
    }

    static findByUserId(id) {
        const sql = `SELECT * FROM orderlist WHERE userId = '${id}'`;
        return db.execute(sql);
    };

    static findById(id) {
        const sql = `SELECT * FROM orderlist WHERE id = '${id}'`;
        return db.execute(sql);
    };

    static getAllOrederList(){
        const sql = `SELECT * FROM orderlist ORDER BY orderHistory DESC`;
        return db.execute(sql);
    }

    static getAllActiveOrder() {
        const sql = `SELECT * FROM orderlist WHERE close = '0' ORDER BY orderHistory DESC`;
        return db.execute(sql);
    }

    static getAllDeactiveOrder() {
        const sql = `SELECT * FROM orderlist WHERE close = '1' ORDER BY orderHistory DESC`;
        return db.execute(sql);
    }

    static async update(id, updatedData){
        let updateQuery = 'UPDATE orderlist SET ';

        const updateValues = [];
        for (const key in updatedData) {
            if (Object.hasOwnProperty.call(updatedData, key)){
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
            return err.code;
           })
    };

    static deleteById(id) {
        const sql = `DELETE FROM orderlist WHERE id = '${id}'`
        return db.execute(sql);
    }

    static getAllTurnover() {
        const sql =`
        SELECT YEAR(orderHistory) AS year, MONTH(orderHistory) AS month, SUM(totalPrice) AS total
        FROM orderlist WHERE close = 1
        GROUP BY YEAR(orderHistory), MONTH(orderHistory)
        ORDER BY YEAR(orderHistory) DESC, MONTH(orderHistory) DESC;`
        return db.execute(sql);
    }

    static getGeneralTurnover() {
        const sql =`SELECT SUM(totalPrice) AS total 
        FROM orderlist WHERE close = 1;`
        return db.execute(sql);
    }

    static getThisWeekTurnover() {
        const sql =`
        SELECT SUM(totalPrice) AS total 
        FROM orderlist 
        WHERE YEARWEEK(orderHistory, 1) = YEARWEEK(CURDATE(), 1) AND close = 1;`
        return db.execute(sql);
    }

    static getThisDayTurnover() {
        const sql =`
        SELECT SUM(totalPrice) AS total 
        FROM orderlist 
        WHERE close = 1 AND DAY(orderHistory) = DAY(CURDATE()) AND MONTH(orderHistory) = MONTH(CURDATE()) AND YEAR(orderHistory) = YEAR(CURDATE());`
        return db.execute(sql);
    }
    
    static getThisWeekSold() {
        const sql =`
        SELECT *
        FROM orderlist
        WHERE close = 1 AND YEARWEEK(orderHistory, 1) = YEARWEEK(CURDATE(), 1);`
        return db.execute(sql);
    }

    static getThisMonthSold() {
        const sql = `
            SELECT *
            FROM orderlist
            WHERE close = 1 AND MONTH(orderHistory) = MONTH(CURDATE()) AND YEAR(orderHistory) = YEAR(CURDATE());
        `;
        return db.execute(sql);
    }

    static getTodaySold() {
        const sql = `
            SELECT *
            FROM orderlist
            WHERE close = 1 AND DAY(orderHistory) = DAY(CURDATE()) AND MONTH(orderHistory) = MONTH(CURDATE()) AND YEAR(orderHistory) = YEAR(CURDATE());
        `;
        return db.execute(sql);
    }


    static getTurnoverDayOfDay() {
        const sql = `
        SELECT 
        DAYNAME(orderHistory) AS day,
        SUM(totalPrice) AS total 
        FROM 
        orderlist 
        WHERE
        close = 1 AND
        YEAR(orderHistory) = YEAR(CURDATE()) 
        AND WEEK(orderHistory) = WEEK(CURDATE())
        GROUP BY 
        DAYNAME(orderHistory)
        ORDER BY 
        MIN(orderHistory);
        `
        return db.execute(sql);
    }

    static getTurnoverWeekOfWeek() {
        const sql = `
        SELECT 
        WEEK(orderHistory) AS week,
        SUM(totalPrice) AS total,
        MIN(DATE(orderHistory - INTERVAL WEEKDAY(orderHistory) DAY)) AS week_start_date,
        MAX(DATE(orderHistory - INTERVAL WEEKDAY(orderHistory) - 6 DAY)) AS week_end_date
        FROM 
            orderlist 
        WHERE
            close = 1 
            AND YEAR(orderHistory) = YEAR(CURDATE())
            AND MONTH(orderHistory) = MONTH(CURDATE())
        GROUP BY 
            WEEK(orderHistory)
        ORDER BY 
            MIN(orderHistory);
        `
        return db.execute(sql);
    }
    
    
    
};

module.exports = OrderList;
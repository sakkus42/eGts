USE eGts;

CREATE TABLE orderlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productData JSON NOT NULL,
    totalPrice INT NOT NULL,
    userId INT DEFAULT NULL,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    sirname     VARCHAR(255) NOT NULL,
    address      TEXT DEFAULT NULL,
    note          TEXT DEFAULT NULL,
    cargoNumber   VARCHAR(100) DEFAULT NULL,
    orderHistory   CURRENT_TIMESTAMP DEFAULT NOW(),
    close          BOOLEAN DEFAULT 0,
    pay          BOOLEAN DEFAULT 0
);
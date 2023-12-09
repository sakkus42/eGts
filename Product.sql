USE eGts;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    brandSlug VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    sold INT DEFAULT 0,
    images JSON,
    color JSON NOT NULL,
    discont INT DEFAULT 0,
    oldPrice INT DEFAULT 0,
    giftCategory VARCHAR(100) DEFAULT NULL,
    giftCount INT DEFAULT 0,
    import BOOLEAN DEFAULT 0,
    giftContent VARCHAR(100) DEFAULT NULL
);



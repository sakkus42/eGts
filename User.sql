USE eGts;

CREATE TABLE user(
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    email        VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    sirname     VARCHAR(255) NOT NULL,
    psw         VARCHAR(255) NOT NULL,
    address      TEXT DEFAULT NULL,
    isAdmin     BOOLEAN DEFAULT FALSE,
    created     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


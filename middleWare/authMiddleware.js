const jwt  = require("jsonwebtoken");
const User = require("../model/User");

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    try{
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err){
                res.redirect("/user");
            }else{
                next();
            }
        })
    }catch(err){
        console.log(err);
    }
};

const authCtrl = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token){
        next();
        return;
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err){
                throw err;
            }else{
                res.locals.isLog = "selam";
                const [user, _] = await User.findById(decodedToken.userId);
                res.locals.user = user[0];
            }
            next();
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = { 
    authenticateToken,
    authCtrl,
}
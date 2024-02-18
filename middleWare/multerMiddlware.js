const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/images/product')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

var upload = multer({ 
  storage: storage,
  limits: {fileSize: 5000000}
}).any();


// singleUpload.js

const storageSingle = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/images/product');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const singleUpload = multer({ 
  storage: storageSingle,
  limits: { fileSize: 1000000 }
}).single('file'); // Tek dosya yüklemesi için 'image' form alanını belirtin

module.exports = { upload, singleUpload };

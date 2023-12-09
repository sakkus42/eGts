const { singleUpload } = require('../middleWare/multerMiddlware');
const Carrousel = require('../model/Carrousel');
const db = require('../config');

const createCarrousel = async (req, res) =>  { 
    singleUpload(req, res, async (err) => {
        if (!err && req.files != ""){
            res.status(200).send();
        } else if (!err && req.files == ""){
            res.statusMessage = "Fotoğraf seçimi yapınız"
            res.status(400).end();
        } else{
            res.statusMessage = err
            res.status(400).end();
        }
        const file = req.file.filename
        const carrousel = new Carrousel({title: req.body.title, content: req.body.content, file :file})
        await carrousel.save();
    });
    res.redirect('/admin/carrousel')
}

const deleteCarrousel = async (req, res) => {
    const sql = `DELETE FROM carrousel WHERE id = '${req.params.id}'`
    await db.execute(sql);
    res.end();
}


module.exports = {
    deleteCarrousel,
    createCarrousel,
};
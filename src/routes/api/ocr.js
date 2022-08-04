const router = require('express').Router();
const ocr = require('../../logic/ocr');
const path = require('path');
const fs = require('fs-extra');
const multer = require("multer");
const tempStoragePath = 'tmp/uploads/';
const ocrAllowedFileTypes = [
    '.png',
    '.jpg',
    '.jpeg'
];
// SET STORAGE
const upload = multer({ dest: tempStoragePath});
// ocr
router.post('/ocr',upload.single('file'), async (req, res, next)=>{
    if(!ocrAllowedFileTypes.includes(path.extname(req.file.originalname))){
        res.sendStatus(400);
    }
    else{
        var result = await ocr.process(req.file.path);
        res.send(result);
    }
    fs.rm(req.file.path);
});


module.exports = router;

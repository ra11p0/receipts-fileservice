const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const url = require('url');
const fs = require('fs-extra');
const tempStoragePath = 'tmp/uploads/';
const fileLogic = require('../../logic/filesLogic');
const fileTypes = require('../../logic/fileTypes');
const glob = require('glob');
// SET STORAGE
const upload = multer({ dest: tempStoragePath});

router.get('/ping', (req, res, next)=>{
    res.sendStatus(200);
});

router.get('/cdn/:fileType/:guid', async (req, res, next)=>{
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const size = query.size;
    const fileType = req.params.fileType;
    const guid = req.params.guid;
    if(!fileTypes[fileType]) {
        res.sendStatus(400);
        return;
    }
    var queryPath = process.cwd().concat('/storage/',fileType,'/*/*/', guid, ".*");
    glob(queryPath, async (err, files)=>{
        files = files.filter(e=>fileTypes[fileType].allowedFileFormats.includes(path.extname(e)));
        if(files.length == 0){
            res.sendStatus(404);
            return;
        }
        var pathArr = files[0].split('/');
        var contentType = pathArr[pathArr.length-3]
        if(contentType == 'image')
            await fileLogic.processResizing(size, files[0], res);
        else res.sendFile(files[0]);
        
    });
});

//FILE UPLOAD
router.post('/cdn/:fileType', upload.single('file'), (req, res, next)=>{
    var file = req.file;
    var fileType = req.params.fileType;
    fileLogic.processSaveFileRequest(fileType, req.headers.host, file, res);
});

//TEST FRONT
router.get('/uploadTest', (req, res, next)=>{
    res.sendFile('/Users/przemyslawlenczewski/source/repos/receipts-fileservice/src/frontTest/index.html');
});

module.exports = router;
const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const url = require('url');
const tempStoragePath = 'tmp/uploads/';
const fileLogic = require('../../logic/filesLogic');
const fileTypes = require('../../logic/fileTypes');
const glob = require('glob');
// SET STORAGE
const upload = multer({ dest: tempStoragePath});


router.get('/cdn/:fileType/:guid', async (req, res, next)=>{
    const fileType = req.params.fileType;
    if(!fileTypes[fileType]) {
        res.sendStatus(400);
    }
    else{
        const url_parts = url.parse(req.url, true);
        const query = url_parts.query;
        const size = query.size;
        const guid = req.params.guid;
        var queryPath = process.cwd().concat('/storage/',fileType,'/*/*/', guid, ".*");
        glob(queryPath, async (err, files)=>{
            files = files.filter(e=>fileTypes[fileType].allowedFileFormats.includes(path.extname(e)));
            if(files.length == 0){
                res.sendStatus(404);
            }
            else{
                var pathArr = files[0].split('/');
                var contentType = pathArr[pathArr.length-3]
                if(contentType == 'image')
                    await fileLogic.processResizing(size, files[0], res);
                else res.sendFile(files[0]);
            }
        });
    }
});

//get filetype details
router.get('/cdn/:fileType', async (req, res, next)=>{
    const fileType = req.params.fileType;
    if(!fileTypes[fileType]) {
        res.sendStatus(400);
    }
    else{
        res.send(fileTypes[fileType]);
    }
});

//FILE UPLOAD
router.post('/cdn/:fileType', upload.single('file'), async (req, res, next)=>{
    var file = req.file;
    var fileType = req.params.fileType;
    await fileLogic.processSaveFileRequest(fileType, req.headers.host, file, res);
});

module.exports = router;
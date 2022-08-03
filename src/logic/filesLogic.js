const fs = require('fs-extra');
const path = require('path');
const sharp = require("sharp");
const fileSizes = require('./fileSizes');
const fileTypes = require('./fileTypes');

async function processSaveFileRequest(fileType, host, file, response){
    const fileName = file.filename;
    const filePath = file.path;
    const mimeType = file.mimetype;
    const fileExtension = path.extname(file.originalname);
    if(!fileTypes[fileType]){
        response.sendStatus(406);
        return;
    }
    if(!fileTypes[fileType].allowedFileFormats.includes(fileExtension)){
        response.sendStatus(415);
        return;
    }

    var newPath = 'storage/'.concat(fileType,'/',mimeType,'/',fileName, fileExtension);
    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    if(fileTypes[fileType].isPhoto){
        await sharp(filePath)
        .resize(fileTypes[fileType].resize)
        .webp({quality: fileTypes[fileType].quality})
        .toFile(newPath);
        fs.removeSync(filePath, function (err) {
            if (err) throw err
        })
    }
    else{
        fs.moveSync(filePath, newPath, function (err) {
            if (err) throw err
        })
    }


    var url = 'http://'.concat(host,'/api/cdn/',fileType,'/',fileName);
    response.send({
        status: 'ok',
        url: url,
        guid: fileName
    });
};

async function processResizing(size, pathToFile, response){
    const fileFormat = path.extname(pathToFile);
    var pathToResizedFile = pathToFile.concat('.resized.', size, '.', fileFormat);
    var dimensions = fileSizes[size];
    await sharp(pathToFile)
        .resize(dimensions)
        .toFile(pathToResizedFile);
    response.sendFile(pathToResizedFile);
    fs.rm(pathToResizedFile);
}

module.exports = {
    processSaveFileRequest: processSaveFileRequest,
    processResizing: processResizing
};
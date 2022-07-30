const fs = require('fs-extra');
const path = require('path');
const sharp = require("sharp");
const fileSizes = require('./fileSizes');
const fileTypes = require('./fileTypes');

function processSaveFileRequest(fileType, host, file, response){
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
    fs.moveSync(filePath, newPath, function (err) {
        if (err) throw err
    })
    var url = 'http://'.concat(host,'/api/cdn/',fileType,'/',mimeType,'/',fileName);
    response.send({
        status: 'ok',
        url: url
    });
};

async function processGetFileRequest(fileType, contentType, fileFormat, guid, size, response){
    const pathToFile = process.cwd()+'/storage/'.concat(fileType, '/', contentType, '/', fileFormat, '/', guid, '.', fileFormat);
    fs.access(pathToFile, fs.F_OK, async (err) => {
        if (err) {
          response.sendStatus(404);
          return;
        }
      
        if(contentType == 'image' && size != undefined){
            await processResizing(size, pathToFile, response, fileFormat);
            return;
        }
        response.sendFile(pathToFile);
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
    processGetFileRequest: processGetFileRequest,
    processResizing: processResizing
};
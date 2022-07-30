const fileTypes = {
    storeImage:{
        allowedFileFormats: [
            '.jpg',
            '.png'
        ]
    },
    productImage:{
        allowedFileFormats: [
            '.jpg',
            '.jpeg',
            '.png'
        ]
    },
    document:{
        allowedFileFormats:[
            '.pdf'
        ]
    }
};
module.exports = fileTypes;
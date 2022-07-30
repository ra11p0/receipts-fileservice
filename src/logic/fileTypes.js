const fileTypes = {
    storeImage:{
        isPhoto: true,
        allowedFileFormats: [
            '.jpg',
            '.png'
        ]
    },
    productImage:{
        isPhoto: true,
        quality: 80,
        resize: 1000,
        allowedFileFormats: [
            '.jpg',
            '.jpeg',
            '.png'
        ]
    },
    document:{
        isPhoto: false,
        allowedFileFormats:[
            '.pdf'
        ]
    }
};
module.exports = fileTypes;
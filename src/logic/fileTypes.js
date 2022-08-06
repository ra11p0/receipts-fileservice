const fileTypes = {
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
    storeImage:{
        isPhoto: true,
        quality: 80,
        resize: 1000,
        allowedFileFormats: [
            '.jpg',
            '.jpeg',
            '.png'
        ]
    },
    profileImage:{
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
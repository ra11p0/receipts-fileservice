const router = require('express').Router();
const cdnproxy = require('./api/cdnproxy');
const ocr = require('./api/ocr');

router.use('/api', cdnproxy);
router.use('/api', ocr);
//TEST FRONT
router.get('/', (req, res, next)=>{
    res.sendFile(__dirname + '/front/index.html');
});
module.exports = router;
const { createWorker } = require('tesseract.js');
async function processReceipt(image){
    const worker = createWorker();
    var response;
    await (async () => {
    await worker.load();
    await worker.loadLanguage('pol');
    await worker.initialize('pol');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm*,= ',
    });
    const { data: { text } } = await worker.recognize(image);
    response = text;
    await worker.terminate();
    })();
    var rows = response.split('\n');
    response.forEach(e=>{
        e = e.split('=');
    });
    return rows;
}
module.exports = {
    processReceipt: processReceipt,
};
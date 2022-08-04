const { createWorker } = require('tesseract.js');
async function process(image){
    const worker = createWorker();
    var lines;
    await (async () => {
    await worker.load();
    await worker.loadLanguage('pol');
    await worker.initialize('pol');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm, ',
    });
    const { data: { text } } = await worker.recognize(image);
    lines = text.split('\n');
    await worker.terminate();
    })();
    return lines;
}
module.exports = {
    process: process,
};
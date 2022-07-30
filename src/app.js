const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();
const port = 3000;

var corsOptions = {
    origin: 'https://127.0.0.1:7106',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

app.use(routes);
  
app.listen(port, () => {
    console.log(`Service listening on port ${port}`);
});
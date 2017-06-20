const express = require('express')
const bodyParser = require('body-parser')
const file = require('./server/api/file');
const path = require('path');

const app = express();
const http = require('http').Server(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use('/api/file', file);

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

var port = process.env.PORT || 5000;
http.listen(port, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server is listening at ${port}...`);
    }    
});
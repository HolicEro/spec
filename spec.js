'use strict';

const
    http = require('http'),
    express = require('express'),
    util = require('util'),
    hostname = 120.24.88.103,
    path = require('path');

const spec = express();

//托管静态文件
spec.use('/static', express.static(path.join(__dirname, 'public')));

spec.get('/', function(req, res) {
    res.sendfile('index.html');


    console.log('request in');

});

spec.get('/api', function(req, res) {
    console.log('api request received with datasize = ', req.query.dataSize);
    const dataSize = req.query.dataSize;
    const list = generateList(dataSize);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        data: list
    }));
});


spec.listen(3000, hostname, () => {
    console.log('server online, listening on port 3000');
});

function generateList(x) {
    const list = [];
    for (var i = 0; i < x; i++) {
        list.push(Math.ceil(Math.random() * x));
    }
    return list;
}
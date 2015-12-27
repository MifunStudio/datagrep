var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/client', express.static(__dirname + '/client'));

app.all('/**', function(req, res) {
    var paths = req.path.split('/');
    if(paths.length === 3) {
        require('./' + paths[1])[paths[2]](req, res);
    } else {
        res.send('Path: ' + req.path + ' not resolved');
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

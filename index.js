var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var log = require('./log');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/client', express.static(__dirname + '/client'));
app.use('/game', express.static(__dirname + '/game'));

app.all('/**', function(req, res) {
    var paths = req.path.split('/');
    if(paths.length === 3) {
        require('./' + paths[1])[paths[2]](req, res);
    } else {
        res.send('Path: ' + req.path + ' not resolved');
    }
});

app.use(log);

app.listen(3000);

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var log = require('./log');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/client', express.static(__dirname + '/client'));

app.all('/**', function(req, res) {
    var paths = req.path.split('/');
    console.log(req.path, paths.length);
    if(paths.length === 3) {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            require('./' + paths[1])[paths[2]](req, res);
        } catch(e) {
            console.log(e);
        }
    } else {
        res.send('Path: ' + req.path + ' not resolved');
    }
});

app.use(log);

app.listen(3000);

console.log('server start at 3000');

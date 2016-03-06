var fs = require('fs');
var typeOf = require('typeof');
var trim = require('trim');
var qiniu = require("qiniu");
var md5 = require('md5');

qiniu.conf.ACCESS_KEY = 'KgroER2TrQ-fuC4VnQboyrr46wDZLJP2bgZX6Aww';
qiniu.conf.SECRET_KEY = '6iO9SYqeqDvsROyiypfb3iA9I4YzTeOzxf1Wj0om';

function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

function uploadFile(uptoken, key, localFile, callback) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        callback(err);
    });
}

var bucket = 'dragoncave';

var fileData;

function getFileData(callback) {
    if(fileData) {
        callback && callback(fileData);
        return;
    }

    var filePath = __dirname + '/datatable/tables.json';
    if(!fs.existsSync(filePath)) {
        fileData = [];
        callback && callback(fileData);
        return;
    }
    fs.readFile(filePath, 'utf8', function(err, data) {
        if(err) {
            callback && callback(null);
            return;
        }
        if(trim(data)) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                data = [];
            }
        } else {
            data = [];
        }
        fileData = data;
        callback && callback(fileData);
    });
}

function saveFileData(callback) {
    fs.writeFile(__dirname + '/datatable/tables.json', JSON.stringify(fileData, null, '  '), 'utf8', callback);
}

function findDataTable(id) {
    for(var i=0; i<fileData.length; i++) {
        var tableItem = fileData[i];
        if(tableItem.id === id) {
            return tableItem;
        }
    }
    return null;
}

function removeDataTable(id) {
    for(var i=0; i<fileData.length; i++) {
        var tableItem = fileData[i];
        if(tableItem.id === id) {
            fileData.splice(i, 1);
            return true;
        }
    }
    return false;
}

function callbackSend(callbackId, data, req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    var result = 'window.' + callbackId + '(' +  JSON.stringify(data) + ')';
    res.send(result);
}

function transformArrayToHash(data, key) {
    var hashData = {};
    data.forEach(function(row) {
        hashData[row[key]] = row;
    });
    return hashData;
}

module.exports = {

    upload: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var dir = __dirname + '/datatable/tables';
        fs.readdir(dir, function(err, files) {
            if(err) {
                res.send({
                    success: !err,
                    error: err
                });
                return;
            }
            var md5KeyMap = {};

            function queueUpload(onComplete) {
                var file = files.shift();
                if(!file) {
                    onComplete();
                    return;
                }

                if(file.indexOf('.json') !== -1) {
                    console.log('upload ' + file);
                    var content = fs.readFileSync(dir + '/' + file, 'utf8');
                    var md5Key = md5(content);
                    var filename = md5Key + '.json';
                    console.log(file + ' => ' + filename)
                    var token = uptoken(bucket, filename);
                    uploadFile(token, filename, dir + '/' + file, function(err) {
                        if(err) {
                            onComplete(err);
                            return;
                        }
                        md5KeyMap[file] = filename;
                        queueUpload(onComplete);
                    });
                } else {
                    console.log('skip ' + file);
                    queueUpload(onComplete);
                }
            }

            queueUpload(function(err) {
                if(err) {
                    res.send({
                        success: !err,
                        error: err
                    });
                    return;
                }

                console.log('upload file.json');
                var token = uptoken(bucket, 'file.json');
                fs.writeFileSync(dir + '/file.json', JSON.stringify(md5KeyMap, null, '  '), 'utf8');
                uploadFile(token, 'file.json', dir + '/file.json', function(err) {
                    if(err) {
                        res.send({
                            success: !err,
                            error: err
                        });
                        return;
                    }
                    res.send({
                        success: true
                    });
                });
            });
        });
    },

    list: function(req, res) {
        getFileData(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.send({
                success: !!data,
                data: data
            });
        });
    },

    create: function(req, res) {
        fileData.push(req.body);
        saveFileData(function(err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({
                success: !err,
                message: err
            });
        });
    },

    update: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var id = req.body.id;
        var tableItem = findDataTable(id);
        if(!tableItem) {
            res.send({
                success: false,
                message: 'table not found'
            });
            return;
        }
        tableItem.columns = req.body.columns;
        saveFileData(function(err) {
            res.send({
                success: !err,
                message: err
            });
        });
    },

    remove: function(req, res) {
        var id = req.body.id;
        var success = removeDataTable(id);
        res.setHeader('Content-Type', 'application/json');
        res.send({
            success: success
        });
    },

    loadTable: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var table = req.query.table;
        var callbackId = req.query.callback;
        var dtype = req.query.dtype;
        var key = req.query.key;

        var isHash = dtype === 'hash';

        var tableFilePath = __dirname + '/datatable/tables/' + table + '.json';
        if(!fs.existsSync(tableFilePath)) {
            if(callbackId) {
                callbackSend(callbackId, {
                    success: true,
                    data: isHash ? {} : []
                }, req, res);
                return;
            }
            res.send({
                success: true,
                data: []
            });
            return;
        }
        fs.readFile(tableFilePath, 'utf8', function(err, data) {
            if(err) {
                if(callbackId) {
                    callbackSend(callbackId, {
                        success: !err,
                        message: err
                    }, req, res);
                    return;
                }
                res.send({
                    success: !err,
                    message: err
                });
                return;
            }

            if(trim(data)) {
                try {
                    data = JSON.parse(data);
                    if(isHash) {
                        data = transformArrayToHash(data, key);
                    }
                } catch(e) {
                    err = e;
                }
            } else {
                data = isHash ? {} : [];
            }
            if(callbackId) {
                callbackSend(callbackId, {
                    success: !err,
                    message: err,
                    data: data
                }, req, res);
                return;
            }
            res.send({
                success: !err,
                data: data,
                message: err
            });
        });
    },

    saveTable: function(req, res) {
        var data = req.body.data;
        var table = req.query.table;
        var tableFilePath = __dirname + '/datatable/tables/' + table + '.json';
        if(typeOf(data) !== 'array') {
            data = [data];
        }
        fs.writeFile(tableFilePath, JSON.stringify(data, null, '  '), function(err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({
                success: !err,
                message: err
            });
        });
    }
};

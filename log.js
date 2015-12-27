var fs = require('fs');

var errorLogfile = fs.createWriteStream(__dirname + '/logs/error.log', { flags: 'a' });

module.exports = function(err, req, res, next) {
    var date = new Date();
    var meta = '[' + date.toLocaleDateString() + '] ' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
    next();
};

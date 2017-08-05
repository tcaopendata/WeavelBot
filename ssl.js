var fs = require('fs');
var privateKey  = fs.readFileSync('ssl/private.pem');
var certificate = fs.readFileSync('ssl/cert.pem');
var ssl = { key: privateKey, cert: certificate };

module.exports = ssl

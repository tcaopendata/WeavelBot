const fs = require('fs');
const privateKey  = fs.readFileSync('ssl/private.pem');
const certificate = fs.readFileSync('ssl/cert.pem');
const ssl = { key: privateKey, cert: certificate };

module.exports = ssl

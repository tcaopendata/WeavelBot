const mysql = require('mysql')

const dbConnection = mysql.createConnection({
  host: '0.tcp.ngrok.io',
  port: 14550,
  user: 'root',
  password: require('./secret').sql_pwd,
  database: 'weather'
})

dbConnection.connect((err) => {
  if (err) throw err;
  console.log((new Date()) + ' MYSQL client is connected');
});

function query(callback, table, collumn, whereClause = '') {
  dbConnection.query(`SELECT ${collumn} from ${table} ${whereClause}`, callback)
}

function getSites(num, location, condition, callback) {
  query(
    (err, res, field) => {
      if (err) throw err;
      let sites = [];
      for (let i = 0; i < num; ++i) {
        sites.push(res[Math.floor(Math.random() * res.length)]);
      }
      callback(sites);
    },
    `${location}_${condition}_spot`, 'name');
}

module.exports = {
  query: query,
  getSites: getSites
}

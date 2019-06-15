var mysql = require('mysql')
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "remotemysql.com",
        user: "lctDVR0MS2",
        password: "PtkguudkSW",
        database: "lctDVR0MS2",
        port:3306

})
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})
module.exports = pool

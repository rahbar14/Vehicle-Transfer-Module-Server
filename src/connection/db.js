const mysqlClient = require("mysql2");
const mysqlPromiseClient = require("mysql2/promise");
const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
}


exports.mysql = mysqlClient.createPool(dbConfig);

exports.mysqlPromise = mysqlPromiseClient.createPool(dbConfig);

exports.testConnection = async () => {
    try {
        await this.mysqlPromise.query("SELECT 1");
        console.log("DB Connected")
    } catch (error) {
        console.log("DB Error: ", error)
    }
}
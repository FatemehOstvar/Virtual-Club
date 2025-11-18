const { Pool } = require('pg')
require('dotenv').config()
module.exports.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
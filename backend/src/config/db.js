const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

pool.on('connect', () =>{
    console.log('PostgreSQL Neon Database connected Successfully');
});

pool.on('error', (err) => {
    console.error('PostgreSQL Database Connection Failed.', err);
});

module.exports = pool;
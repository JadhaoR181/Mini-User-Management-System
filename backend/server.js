require('dotenv').config();
const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const pool = require('./src/config/db');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Test DB Connection
pool.query('SELECT NOW()', (err, res) =>{
    if(err) {
        console.error('Database Connection Error: ', err.message);
    }
    else {
        console.log('Database Connected at: ', res.rows[0].now);
    }
});

//Main Route
app.get('/', (req, res) =>{
    res.json({
        message: 'PurpleMerit User Management API',
        status: 'Server is Running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', async (req, res) =>{
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            status: 'OK',
            database: 'Connected',
            timestamp: result.rows[0].now
        });
    }
    catch(error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Disconnected',
            error: error.message
        });
    }
});

//API routes
app.use('/api/auth', authRoutes);

//not found handler 404
app.use(notFoundHandler);

//global error handler
app.use(errorHandler);

//Server Configuration
app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost: ${PORT}`);
});

module.exports = app;
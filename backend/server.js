require('dotenv').config();
const express = require('express');
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Main Route
app.get('/', (req, res) =>{
    res.json({
        message: 'PurpleMerit User Management API',
        status: 'Server is Running',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) =>{
    res.status(200).json({
        status: 'OK'
    });
});

app.listen(PORT, () =>{
    console.log(`Server is running on http://;localhost: ${PORT}`);
});
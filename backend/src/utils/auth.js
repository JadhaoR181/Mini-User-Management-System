const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//hasing the password using bcrypt
const hashPassword = async(password) => {
    try {
        const saltRounds= 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
    catch (error) {
        throw new Error('Error hashing password');
    }
};

//comparing plain password with hashed password
const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    }
     catch (error) {
        throw new Error('Error comparing passwords');
     }
};

//generate JWT Token
const generateToken = (userId, email, role) => {
    try{
        const payload = {
            id: userId,
            email: email,
            role: role
        };

        const token = jwt.sign(
            payload, process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE || '7d'}
        );

        return token;
    }
    catch (error) {
        throw new Error ('Error generating token');
    }
};

// Verify the generated JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return null;
        }
        if (error.name === 'TokenExpiredError') {
            return null;
        }
        return null;
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};
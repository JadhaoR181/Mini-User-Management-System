const pool = require('../config/db');

const userModel = {

    //Create a New user
    createUser: async (email, passwordHash, fullName, role = 'user') => {
        const query = `
           INSERT INTO users(email, password_hash, full_name, role, status)
           VALUES ($1, $2, $3, $4, 'active')
           RETURNING id, email, full_name, role, status, created_at
        `;
        const values = [email, passwordHash, fullName, role];

        try{
            const result = await pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            throw error;
        }
    },

    //Find User by email
    findByEmail : async(email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
        try{
            const result = await pool.query(query, [email]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
    },

    //Find user by Id
    findById : async(id) => {
        const query =`
        SELECT id, email, full_name, role, status, created_at, updated_at, last_login
        FROM users
        WHERE id = $1
        `;
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
    },

    //updated last login timestamp
    updateLastLogin: async (id) => {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    
    try {
      await pool.query(query, [id]);
    } catch (error) {
      throw error;
    }
},

    //Check if email exists
    emailExists: async (email) => {
        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';

        try {
            const result = await pool.query(query, [email]);
            return result.rows[0].exists;
        }
        catch (error) {
            throw error;
        }
    }
};

module.exports = userModel;
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
    },

    //Get all users
    getAllUsers: async (limit, offset) => {
        const query= `
        SELECT id, email, full_name, role, status, created_at, last_login
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `;

        try{
            const result = await pool.query(query, [limit, offset]);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
    },

    //Get total count of users
    getUserCount: async () => {
        const query = 'SELECT COUNT(*) FROM users';
        try{
            const result = await pool.query(query);
            return parseInt(result.rows[0].count);
        }
        catch (error) {
            throw error;
        }
    },

    //Get users count by their status Active or Invactive
    getUserCountByStatus: async (status) => {
        const query = 'SELECT COUNT(*) FROM users WHERE status = $1';
        try {
            const result = await pool.query(query, [status]);
            return parseInt(result.rows[0].count);
        }
        catch( error) {
            throw error;
        }
    },

    //Update user status activate or deactivate
    updateUserStatus: async (id, status) => {
        const query =`
        UPDATE users
        SET status = $1
        WHERE id = $2
        RETURNING id, email, full_name, role, status, updated_at
        `;
        try{
            const result = await pool.query(query, [status, id]);
            return result.rows[0];
        }
        catch (error) {
            throw error;
        }
    },

    //Update user profile
    updateUserProfile: async (id, fullName, email) => {
        const query =`
        UPDATE users
        SET full_name = $1, email = $2
        WHERE id = $3
        RETURNING id, email, full_name, role, status, updated_at
        `;
        try{
            const result = await pool.query(query, [fullName, email, id]);
            return result.rows[0];
        }
        catch (error) {
            throw error;
        }
    },

    //Update user password
    updatePassword: async (id, newPasswordHash) => {
        const query = 'UPDATE users SET password_hash = $1 WHERE id = $2';
        try{
            await pool.query(query, [newPasswordHash, id]);
        }
        catch (error) {
            throw error;
        }
    },

    //check if email exists for another user
    emailExistsForOtherUser: async (email, userId) => {
        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND id != $2';
        try {
            const result = await pool.query(query, [email, userId]);
            return result.rows[0].exists;
        }
        catch (error) {
            throw error;
        }
    }
};

module.exports = userModel;
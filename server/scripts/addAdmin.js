const pool = require('../config/db');

async function addAdmin() {
    const email = 'osasguidancecounselling@gmail.com';
    const password = 'curamengadmin01!';

    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length === 0) {
            await pool.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, password]);
            console.log('Admin user added successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error adding admin user:', error);
    } finally {
        pool.end();
    }
}

addAdmin();

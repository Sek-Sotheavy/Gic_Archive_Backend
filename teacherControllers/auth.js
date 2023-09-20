const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

const signup = async (req, res) => {

    const filename = req.file.originalname;
    const filepath = req.file.path;
    const { first_name, last_name, username, email, password, gender } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.promise().query(
            'INSERT INTO teachers (username, first_name, last_name, email, password, role_id, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, first_name, last_name, email, hashedPassword, 1, gender]
        );
        const user = await db.promise().query(
            'INSERT INTO photo ( teacher_id, student_id,course_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?  LIMIT 1), ?,(SELECT course_id FROM courses where course_name =?), ?,?)',
            [username, null, null, filename, filepath]
        );
        console.log(user);
        res.json({ message: 'Teacher registered successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}


module.exports = {
    signup
}
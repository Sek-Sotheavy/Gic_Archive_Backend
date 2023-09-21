const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'secret';
const isEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM students WHERE email = ?';
        db.query(sql, [email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });
};

const signup = async (req, res) => {

    const filename = req.file.originalname;
    const filepath = req.file.path;
    const { username, email, gender, password, first_name, last_name, generation } = req.body;
    const emailExists = await isEmailExists(email);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (emailExists) {
            res.status(400).send('Email address already exists.');
        } else {
            const sql = 'INSERT INTO students (username ,first_name , last_name, email, password,role_id , gender, generation) VALUES ( ?, ?,?, ?,?,?,?,?)';
            db.query(sql, [username, first_name, last_name, email, hashedPassword, 2, gender, generation], (err, result) => {
                if (err) {
                    res.status(400).send('Student registration failed: ' + err);
                } else {
                    res.status(200).send('Student registered successfully!');
                }
            });
            const user = await db.promise().query(
                'INSERT INTO photo ( teacher_id, student_id,course_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?), ?,?)',
                [null, username, null, filename, filepath]
            );
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}


module.exports = {
    // login,
    signup
}
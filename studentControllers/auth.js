const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

// const getUserByEmail = async (email, password, role_name) => {
//     const query = 'SELECT s.* FROM users u join students s  WHERE s.student_id = u.student_id  AND s.email = ? AND s.password =? ';
//     const results = await db.promise().query(query, [email, password]);
//     return results[0];
// }

const signup = async (req, res) => {

    const filename = req.file.originalname;
    const filepath = req.file.path;
    const { username, email, gender, password, first_name, last_name, generation, role_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // const emailExists = await getUserByEmail(email);
        // if (emailExists) {
        //     res.status(400).send('Email address already exists.');
        // }
        // else {
            const sql = 'INSERT INTO students (username ,first_name , last_name, email, password,role_id , gender, generation) VALUES ( ?, ?,?, ?,?,?,?,?)';
            db.query(sql, [username, first_name, last_name, email, hashedPassword, 2, gender, generation], (err, result) => {
                if (err) {
                    res.status(400).send('Student registration failed: ' + err);
                } else {
                    res.status(200).send('Student registered successfully!');
                }
            });
            db.query(
                'INSERT INTO photo ( teacher_id, student_id,course_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?), ?,?)',
                [null, username, null, filename, filepath]
            );
            // db.query(
            //     'INSERT INTO users (student_id, teacher_id ,rold_id) VALUES ((SELECT  student_id From students WHERE email = ?), (SELECT teacher_id From teachers WHERE email = ?),(SELECT role_id FROM roles where role_name =?))',
            //     [email, null, role_name]
            // );
        // }

    }
    catch (error) {
        console.error(error);
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}





module.exports = {
    // login,
    signup,
    //  getUserByEmail
}
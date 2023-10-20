const db = require('../config/db');

const getMe = async (req, res) => {
        const { email, password } = req.body;
        const sql = 'SELECT s.* FROM users u JOIN students s ON s.student_id = u.student_id WHERE s.email = ?';

        try {
                db.query(sql, [email], (err, result) => {
                        if (err) {
                                res.status(500).json({ error: 'Student login failed', message: err.message });
                        } else {
                                if (result.length === 0) {
                                        res.status(404).json({ error: 'No student found with the provided email' });
                                } else {
                                        console.log(result);
                                        res.status(200).json({ message: 'Student login successful', result });
                                }
                        }
                });
        } catch (error) {
                console.error('Error during student login:', error);
                res.status(500).json({ error: 'Internal server error' });
        }
}

module.exports = {
        getMe
}
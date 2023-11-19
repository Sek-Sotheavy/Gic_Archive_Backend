const db = require('../config/db');

const Displayproject = async (req, res) => {
        const project = req.params.id;
        const selectQuery = 'SELECT COUNT(m.member_id) AS member, cl.*,  c.course_name,  d.fileName,  d.filepath, p.filepath AS imagepath FROM classteam_project cl  JOIN  courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id  LEFT JOIN classteamproject_member m ON m.project_id = cl.project_id  LEFT JOIN students s ON s.student_id = m.student_id JOIN photo p ON p.project_id = cl.project_id JOIN teachers te ON te.teacher_id = c.teacher_id WHERE te.teacher_id = ? GROUP BY cl.project_id; ';

        db.query(selectQuery, [project], (err, results) => {
                if (err) {
                        console.error('Error fetching project:', err);
                        res.status(500).send('Internal Server Error');
                } else {
                        if (results.length > 0) {
                                console.log('Project data :', results);
                                res.send(results);
                        } else {
                                console.log('No data found');
                                res.status(404).send('No data found');
                        }
                }
        });
}
const displayStudent = async (req, res) => {
        const sql = 'SELECT CONCAT(first_name," ",last_name) as fullname ,username FROM students;'
        db.query(sql, (err, result) => {
                if (err) {
                        console.log(err);
                        res.status(500).json({ message: 'Error display data' })
                }
                else {
                        res.json(result);
                        // console.log(result);
                }
        })
}
const Student = async (req, res) => {
        try {
                const { username } = req.body;
                const query = 'SELECT student_id FROM students WHERE username LIKE ?';

                db.query(query, [`%${username}%`], (err, result) => {
                        if (err) {
                                console.error(err);
                                res.status(500).json({ success: false, message: 'Error displaying data' });
                        } else {
                                console.log(username);
                                res.json({ success: true, message: 'Data retrieved successfully', result, username });
                        }
                });
        } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
module.exports = {
        Displayproject,
        displayStudent,
        Student
}
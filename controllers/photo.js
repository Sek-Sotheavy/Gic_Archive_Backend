const db = require('../config/db');

const create = async (req, res) => {
        const filename = req.file.originalname;
        const filepath = req.file.path;
        const { teacher_name, student_name, course_name } = req.body;

        await db.promise().query(
                'INSERT INTO photo ( teacher_id, student_id,course_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?), ?,?)',
                [teacher_name, student_name, course_name, filename, filepath], (err, results) => {
                        if (err) {
                                console.error('Error fetching photo', err);
                        }
                        else {
                                res.send(results);
                        }
                        console.log(results);
                });
}


module.exports ={
        create
}

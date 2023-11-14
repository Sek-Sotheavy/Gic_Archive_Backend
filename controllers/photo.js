const db = require('../config/db');

const create = async (req, res) => {
        // const fileMimetype = file.mimetype;
        const filePath = req.file.path;
        const filename = req.file.originalname;
        const { title, descr, course_name, github_url } = req.body;
        await db.promise().query(
                'INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)',
                [null, null, null, title, null, imageName, imagePath], (err, results) => {
                        if (err) {
                                console.error('Error fetching photo', err);
                        }
                        else {
                                res.send(results);
                        }
                        console.log(results);
                });
}


module.exports = {
        create
}

const db = require("../config/db");
const create = async (req, res) => {
  const filename = req.file.originalname;
  const filepath = req.file.path;
  const { teacher_name, student_name, course_name } = req.body;
  db.query('INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)',
            [null, username, null, null, null, filename, filepath], (insertErr, results) => {
                if (insertErr) {
                    console.error('Error inserting photo data:', insertErr);
                } else {
                    console.log('photo inserted successfully');
                    console.log(results);
                }
            }) 
};
module.exports = {
  create,
};

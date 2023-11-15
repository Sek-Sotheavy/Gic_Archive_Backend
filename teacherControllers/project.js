const db = require('../config/db');

const Displayproject = async (req, res) => {
        const project = req.params.id;
        const selectQuery = 'SELECT COUNT(*) AS member, cl.*,  c.course_name,  d.fileName,  d.filepath, p.filepath AS imagepath FROM classteam_project cl  JOIN  courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id  LEFT JOIN classteamproject_member m ON m.project_id = cl.project_id  LEFT JOIN students s ON s.student_id = m.student_id JOIN photo p ON p.project_id = cl.project_id JOIN teachers te ON te.teacher_id = c.teacher_id WHERE te.teacher_id = ? GROUP BY cl.project_id; ';

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

module.exports = {
        Displayproject,
}
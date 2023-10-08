const db = require('../config/db');
const moment = require('moment');

const create = async (req, res) => {

        const pdfMimeType = req.file.minetype;
        const pdfFilePath = req.file.path;
        const filename = req.file.originalname;
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
        const { title, descr, course_name, github_url, username } = req.body;
        try {
                await db.promise().query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, pdfFilePath, pdfMimeType, date]
                )
                await db.promise().query(
                        'INSERT INTO classTeam_project (title, course_id, descr ,github_url, doc_id) VALUES (?,(SELECT course_id FROM courses WHERE course_name =?),?,?,(SELECT doc_id FROM documents WHERE filepath = ? limit 1))',
                        [title, course_name, descr, github_url, pdfFilePath])

                res.json({ message: 'Create successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
}
const update = async (req, res) => {
        const id = req.params.id;
        const { project_name, student_id, descr, course_id } = req.body;

        try {
                const result = await db.promise().query(
                        'UPDATE classTeam_project SET project_name =? , student_id =? , descr = ? , course_id =? WHERE  project_id = ? ',
                        [project_name, student_id, descr, course_id, id]
                );
                console.log(result);
                res.json({ message: 'Update successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
}
// const remove = async (req, res) => {
//         const id = req.params.id;
//         db.query('DELETE FROM classTeam_project WHERE project_id = ?', [id], (err, results) => {
//                 if (err) {
//                         console.error('Error delete project:', err);
//                 } else {
//                         console.log('Team project delete successfully');
//                         res.send('Team project delete successfully');
//                         console.log(results);
//                 }
//         })
// }
const remove = async (req, res) => {
        const id = req.params.id;

        db.query("SET FOREIGN_KEY_CHECKS=0;", (err) => {
                if (err) {
                        console.error("Error disabling foreign key checks:", err);
                } else {
                        db.query(
                                "DELETE FROM classTeam_project WHERE project_id = ? LIMIT 10 ;",
                                [id],
                                (err, results) => {
                                        if (err) {
                                                console.error("Error deleting teacher:", err);
                                        } else {
                                                console.log("teacher deleted successfully");
                                                res.status(200).send("teacher deleted successfully!");
                                                console.log(results);
                                        }
                                        db.query("SET FOREIGN_KEY_CHECKS=1;", (err) => {
                                                if (err) {
                                                        console.error("Error enabling foreign key checks:", err);
                                                }
                                        });
                                }
                        );
                }
        });
};
const displayAll = async (req, res) => {

        db.query('SELECT COUNT(*) AS member, cl.*,  c.course_name,  GROUP_CONCAT(s.username) AS student_names,  d.fileName,  d.filepath FROM classteam_project cl  JOIN  courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id  LEFT JOIN classteamproject_member m ON m.project_id = cl.project_id  LEFT JOIN students s ON s.student_id = m.student_id GROUP BY cl.project_id; ', (err, results) => {
                if (err) {
                        console.error('Error fetching team project:', err);
                }
                else {
                        res.send(results);
                        // console.log(results);¿
                }

        });
}
const displayById = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT cl.*, c.course_name, GROUP_CONCAT(s.username) AS student_names, d.fileName, d.filepath  FROM classteam_project cl JOIN courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id LEFT JOIN  classteamproject_member m ON m.project_id = cl.project_id LEFT JOIN  students s ON s.student_id = m.student_id WHERE cl.project_id = ? GROUP BY cl.project_id; ';

        db.query(selectQuery, [id], (err, results) => {
                if (err) {
                        console.error('Error fetching team project:', err);
                }
                else {
                        if (results.length > 0) {
                                const thesis = results[0];
                                console.log('team_project:', thesis);
                                res.send(results);
                        } else {
                                console.log('Team project not found');
                        }
                }
        });
}
const getbyCourse = async (req, res) => {
        const course_name = req.body.course_name;
        const query = 'SELECT cl.*, c.course_name from courses c join classTeam_project cl WHERE c.course_id = cl.course_id AND c.course_name =? '
        db.query(query, [course_name], (err, results) => {
                if (err) {
                        console.error('Error fetching team project:', err);
                }
                else {
                        if (results.length > 0) {
                                const thesis = results[0];
                                console.log('team_project:', thesis);
                                res.send(results);
                        } else {
                                console.log('Team project not found');
                        }
                }
        })
}
const displayByid = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT cl.*, course_name, t.username AS teacher_name, s.username AS student_name, d.fileName,d.filepath FROM classteam_project cl JOIN courses c ON c.course_id = cl.course_id JOIN teachers t ON t.teacher_id = c.teacher_id JOIN students s ON s.student_id = cl.project_id JOIN documents d ON d.doc_id = cl.doc_id WHERE s.student_id =1 ';

        db.query(selectQuery, [id], (err, results) => {
                if (err) {
                        console.error('Error fetching team project:', err);
                }
                else {
                        if (results.length > 0) {
                                const thesis = results[0];
                                console.log('team_project:', thesis);
                                res.send(results);
                        } else {
                                console.log('Team project not found');
                        }
                }
        });
}
module.exports = {
        create,
        update,
        remove,
        displayAll,
        displayById,
        getbyCourse,
        displayByid

}
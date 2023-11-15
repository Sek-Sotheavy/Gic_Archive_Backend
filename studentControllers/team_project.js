const db = require('../config/db');
const moment = require('moment');

const create = async (req, res) => {

        const { title, descr, course_name, github_url } = req.body;
        const file = req.files['file'][0]; // Assuming 'file' is the field name
        const image = req.files['image'][0]; // Assuming 'image' is the field name

        // Access file properties
        const fileMimetype = file.mimetype;
        const filePath = file.path;
        const filename = file.originalname;

        // Access image properties
        const imageName = image.originalname;
        const imagePath = image.path;
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
        const project =
                'INSERT INTO classTeam_project (title, course_id, descr ,github_url, doc_id) VALUES (?,(SELECT course_id FROM courses WHERE course_name =?),?,?,(SELECT doc_id FROM documents WHERE filepath = ? limit 1))';
        const photo =
                "INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)";

        try {
                db.query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, filePath, fileMimetype, date]
                );
                db.query(project, [title, course_name, descr, github_url, filePath])

                await db.promise().query(photo, [null, null, null, title, null, imageName, imagePath]);
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
}
const update = async (req, res) => {
        const id = req.params.id;
        const course_name = req.body.course_name;
        const sql = "update courses SET course_name= ? where course_id =? ";

        try {
                await db.promise().query(sql, [course_name, id]);
                console.log(req.body.name);
                console.log(id);

                res.json({ message: 'Update successful', updatedData: { course_name: course_name, course_id: id } });

        } catch (error) {
                console.error('Error updating data:', error);
                res.status(500).json({ message: 'Error updating data', error: error.message });
        }
};

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

        db.query('SELECT COUNT(m.member_id) AS member, cl.*,  c.course_name,  d.fileName,  d.filepath, p.filepath AS imagepath FROM classteam_project cl  JOIN  courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id  LEFT JOIN classteamproject_member m ON m.project_id = cl.project_id  LEFT JOIN students s ON s.student_id = m.student_id JOIN photo p ON p.project_id = cl.project_id GROUP BY cl.project_id; ', (err, results) => {
                if (err) {
                        console.error('Error fetching team project:', err);
                }
                else {
                        res.send(results);
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
        const selectQuery = 'SELECT COUNT(m.member_id) AS member, cl.*, CONCAT(t.first_name," ",t.last_name) AS fullname , c.course_name, t.username AS teacher_name,p.filepath as imagepath , GROUP_CONCAT(s.username) AS student_names,  d.fileName,  d.filepath FROM classteam_project cl  JOIN  courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id  LEFT JOIN classteamproject_member m ON m.project_id = cl.project_id  LEFT JOIN students s ON s.student_id = m.student_id JOIN teachers t ON t.teacher_id =c.teacher_id JOIN photo p ON p.project_id = cl.project_id WHERE cl.project_id = ?  GROUP BY cl.project_id';

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
const displayByName = async (req, res) => {
        const name = req.params.name;
        const selectQuery = 'SELECT cl.*, s.username, c.course_name, m.student_id FROM classteam_project cl JOIN classteamproject_member m ON m.project_id =cl.project_id JOIN students s ON s.student_id = m.student_id JOIN courses c on c.course_id = cl.course_id WHERE s.username = ?  ';
        // const selectQuery = 'SELECT cl.*,s.username from classteam_project cl JOIN classteamproject_member m ON m.project_id = cl.project_id JOIN students s ON s.student_id = m.student_id WHERE s.username = "/;'

        db.query(selectQuery, [name], (err, results) => {
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
const displayFilter = async (req, res) => {
        const course_name = req.params.course_name;
        const selectQuery = ' SELECT cl.*, p.filepath as imagepath, c.course_name  FROM classteam_project as cl JOIN courses AS c ON cl.course_id = c.course_id JOIN photo p ON cl.project_id = p.project_id WHERE course_name = ? ';

        db.query(selectQuery, [course_name], (err, results) => {
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
};

// const displayIP = async (req, res) => {
//         const course_name = 'Internet Programming';
//         const selectQuery = ' SELECT * FROM classteam_project as cl JOIN courses AS c ON cl.course_id = c.course_id WHERE course_name = ? ';

//         db.query(selectQuery, [course_name], (err, results) => {
//                 if (err) {
//                         console.error('Error fetching project:', err);
//                         res.status(500).send('Internal Server Error');
//                 } else {
//                         if (results.length > 0) {
//                                 console.log('Project data :', results);
//                                 res.send(results);
//                         } else {
//                                 console.log('No data found');
//                                 res.status(404).send('No data found');
//                         }
//                 }
//         });
// };
// const displayNetwork = async (req, res) => {
//         const course_name = 'Network';
//         const selectQuery = ' SELECT * FROM classteam_project as cl JOIN courses AS c ON cl.course_id = c.course_id WHERE course_name = ? ';

//         db.query(selectQuery, [course_name], (err, results) => {
//                 if (err) {
//                         console.error('Error fetching project:', err);
//                         res.status(500).send('Internal Server Error');
//                 } else {
//                         if (results.length > 0) {
//                                 console.log('Project data :', results);
//                                 res.send(results);
//                         } else {
//                                 console.log('No data found');
//                                 res.status(404).send('No data found');
//                         }
//                 }
//         });
// };

// teacher dashboard 
const displayTeacherproject = async (req, res) => {
        const project = req.params.username;
        const selectQuery = 'SELECT COUNT(*) AS member, cl.*,  c.course_name,  d.fileName,  d.filepath, p.filepath AS imagepath FROM classteam_project cl  JOIN  courses c ON c.course_id = cl.course_id JOIN  documents d ON d.doc_id = cl.doc_id  LEFT JOIN classteamproject_member m ON m.project_id = cl.project_id  LEFT JOIN students s ON s.student_id = m.student_id JOIN photo p ON p.project_id = cl.project_id JOIN teachers te ON te.teacher_id = c.teacher_id WHERE te.username = ? GROUP BY cl.project_id; ';

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
};
module.exports = {
        create,
        update,
        remove,
        displayAll,
        displayFilter,
        getbyCourse,
        displayByid,
        displayByName,
        displayTeacherproject

}
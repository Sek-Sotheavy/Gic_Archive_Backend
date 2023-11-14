const db = require('../config/db')
const moment = require('moment');
const path = require('path');

const displayThesis = async (req, res) => {

        db.query('SELECT t.*, d.fileName, d.filepath, s.username AS student_username, te.username AS teacher_username FROM thesis t JOIN teachers te ON t.teacher_id = te.teacher_id JOIN students s ON s.student_id = t.student_id JOIN documents d ON d.doc_id = t.doc_id ', (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        res.send(results);
                }
                console.log(results);
        });
}
// student dashboard
const display = async (req, res) => {
        const name = req.params.name;
        db.query('SELECT t.*, d.fileName, d.filepath, s.username AS student_username, te.username AS teacher_username FROM thesis t JOIN teachers te ON t.teacher_id = te.teacher_id JOIN students s ON s.student_id = t.student_id JOIN documents d ON d.doc_id = t.doc_id WHERE s.username = ? ; ', [name], (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        res.send(results);
                }
                console.log(results);
        });
}
const create = async (req, res) => {

        const { title, username, descr, field, company, tags, github_url, teacher_name } = req.body;
        const pdfMimeType = req.file.mimetype;
        const pdfFilePath = req.file.path;
        const filename = req.file.originalname;
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
        try {
                db.query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, pdfFilePath, pdfMimeType, date]
                );
                db.query(
                        'INSERT INTO thesis(title, student_id,teacher_id ,descr, field, company, tags, github_url, doc_id) VALUES (?,(SELECT student_id FROM students WHERE username =? ),(SELECT teacher_id FROM teachers WHERE username =? ),?,?,?,?,?,(SELECT doc_id FROM documents WHERE filepath =? limit 1))',
                        [title, username, teacher_name, descr, field, company, tags, github_url, pdfFilePath]);
                await db.promise().query('INSERT INTO image( teacher_id, student_id,course_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT thesis_id FROM courses where title =?), ?,?)',
                        [null, null, null, title, filename, filepath]);
                res.json({ message: 'Thesis Create successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }

}
const displayById = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT t.* FROM thesis t JOIN students s ON s.student_id = t.student_id join users u ON u.student_id = s.student_id WHERE  s.email= ?;';

        db.query(selectQuery, [id], (err, results) => {
                if (err) {
                        console.error('Error fetching thesis:', err);
                }
                else {
                        if (results.length > 0) {
                                const thesis = results[0];
                                console.log('thesis:', thesis);
                                res.send(results);
                        } else {
                                console.log('Thesis not found');
                        }
                }
        });
}
const SearchbyField = async (req, res) => {
        const field = req.body.field;
        const selectQuery = 'SELECT t.*,s.username AS student_username, te.username AS teacher_username FROM thesis t  JOIN teachers te ON t.teacher_id = te.teacher_id JOIN students s ON s.student_id = t.student_id WHERE t.field = ?';

        db.query(selectQuery, [field], (err, results) => {
                if (err) {
                        console.error('Error fetching thesis:', err);
                }
                else {
                        if (results.length > 0) {
                                const thesis = results[0];
                                console.log('thesis:', thesis);
                                res.send(results);
                        } else {
                                console.log('Thesis not found');
                        }
                }
        });
}
const remove = async (req, res) => {
        const id = req.params.id;

        db.query("SET FOREIGN_KEY_CHECKS=0;", (err) => {
                if (err) {
                        console.error("Error disabling foreign key checks:", err);
                } else {
                        db.query(
                                "DELETE FROM thesis WHERE thesis_id = ? LIMIT 10 ;",
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
const update = async (req, res) => {
        const id = req.params.id;
        const { title, descr, field, company, tags, github_url } = req.body;
        db.query('UPDATE thesis SET title =? , descr = ? , company = ? , tags =? , github_url = ? WHERE  thesis_id = ? ', [title, descr, company, tags, github_url, id], (err, result) => {
                if (err) {
                        console.log(err);
                        res.status(500).json({ message: 'Error updating data' })
                }
                else {
                        res.json({ message: 'Data updated successfully' });
                }
        })
}

module.exports = {
        create,
        displayThesis,
        displayById,
        SearchbyField,
        remove,
        display,
        update
}
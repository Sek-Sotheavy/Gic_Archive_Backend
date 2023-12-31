const db = require('../config/db')
const moment = require('moment');
const path = require('path');

const displayThesis = async (req, res) => {

        db.query('SELECT t.*, d.fileName, d.filepath,p.filepath AS imagePath, s.username AS student_username, te.username AS teacher_username FROM thesis t JOIN teachers te ON t.teacher_id = te.teacher_id JOIN students s ON s.student_id = t.student_id JOIN documents d ON d.doc_id = t.doc_id JOIN photo p ON p.thesis_id = t.thesis_id;', (err, results) => {
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
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss AM/PM");
        try {
                await db.promise().query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, pdfFilePath, pdfMimeType, date]
                );
                await db.promise().query(
                        'INSERT INTO thesis(title, student_id,teacher_id ,descr, field, company, tags, github_url, doc_id) VALUES (?,(SELECT student_id FROM students WHERE username =? ),(SELECT teacher_id FROM teachers WHERE username =? ),?,?,?,?,?,(SELECT doc_id FROM documents WHERE filepath =? limit 1))',
                        [title, username, teacher_name, descr, field, company, tags, github_url, pdfFilePath]);
                res.json({ message: 'Create successfully' });

        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }

}
const displayById = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT t.*,i.filepath AS imagePath, d.fileName, d.filepath, CONCAT(s.first_name," ",s.last_name)  AS student_username, CONCAT(te.first_name," ",te.last_name)  AS teacher_username FROM thesis t JOIN teachers te ON t.teacher_id = te.teacher_id JOIN students s ON s.student_id = t.student_id JOIN documents d ON d.doc_id = t.doc_id JOIN photo i ON i.thesis_id = t.thesis_id WHERE t.thesis_id= ?';

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
const displayField = async (req, res) => {
        const field = req.params.field; // Assuming you want to compare to the string 'web'
        const selectQuery = 'SELECT t.*, p.filepath as imagePath FROM thesis t JOIN photo p ON p.thesis_id = t.thesis_id WHERE t.field = ? ';

        db.query(selectQuery, [field], (err, results) => {
                if (err) {
                        console.error('Error fetching thesis:', err);
                        res.status(500).send('Internal Server Error');
                } else {
                        if (results.length > 0) {
                                console.log('Thesis data for :', results);
                                res.send(results);
                        } else {
                                console.log('No data found for Web');
                                res.status(404).send('No data found for Web');
                        }
                }
        });
};


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
                                "DELETE FROM thesis WHERE  thesis_id = ? LIMIT 10 ;",
                                [id],
                                (err, results) => {
                                        if (err) {
                                                console.error("Error deleting thesis:", err);
                                        } else {
                                                console.log("thesis deleted successfully");
                                                res.status(200).send("thesis deleted successfully!");
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
module.exports = {
        create,
        displayThesis,
        displayById,
        SearchbyField,
        remove,
        displayField
}
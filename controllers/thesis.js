const db = require('../config/db');
const moment = require('moment');

const create = async (req, res) => {

        const pdfMimeType = req.file.mimetype;
        const pdfFilePath = req.file.path;
        const filename = req.file.originalname;
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
        const { title, descr, username, field, company, tags, github_url } = req.body;
        try {
                await db.promise().query(
                        'INSERT INTO thesis (title, student_id,descr,field,company,tags,github_url doc_id) VALUES (?,(SELECT student_id FROM students WHERE username =?),?,?,?,?,(SELECT doc_id FROM documents WHERE filepath =?))',
                        [title, username, descr, field, company, tags, github_url, pdfFilePath]);
                await db.promise().query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, pdfFilePath, pdfMimeType, date]
                );

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
const remove = async (req, res) => {
        const id = req.params.id;
        db.query('DELETE FROM thesis WHERE  thesis_id = ?', [id], (err, results) => {
                if (err) {
                        console.error('Error delete project:', err);
                } else {
                        console.log('Team project delete successfully');
                        res.send('Team project delete successfully');
                        console.log(results);
                }
        })
}
const displayAll = async (req, res) => {

        db.query('select * from thesis  ', (err, results) => {
                if (err) {
                        console.error('Error fetching thesis:', err);
                }
                else {
                        res.send(results);
                }
                console.log(results);
        });
}
const displayById = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT * FROM thesis WHERE thesis_id = ?';

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
        displayById
}
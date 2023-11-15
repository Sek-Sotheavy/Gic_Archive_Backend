const db = require('../config/db');

const DisplayThesis = async (req, res) => {
        const thesis = req.params.id;
        const selectQuery = 'SELECT t.*, d.fileName, d.filepath, s.username AS student_username, te.username AS teacher_username FROM thesis t JOIN teachers te ON t.teacher_id = te.teacher_id JOIN students s ON s.student_id = t.student_id JOIN documents d ON d.doc_id = t.doc_id WHERE t.teacher_id = ?;';

        db.query(selectQuery, [thesis], (err, results) => {
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
        DisplayThesis
}
const db = require('../config/db');
const fs = require('fs');
const path = require('path');


const create = async (req, res) => {
        const { course_name, username } = req.body;
        const filename = req.file.originalname;
        const filepath = req.file.path;
        const query = 'INSERT INTO courses (course_name, teacher_id) VALUES (?, (SELECT teacher_id FROM teachers WHERE username = ?))';

        try {
                db.query(query, [course_name, username], (Err, result) => {
                        if (Err) {
                                console.error('Error inserting course:', Err);
                                // res.status(500).send('Internal Server Error');
                        } else {
                                console.log('course successfully');
                                // res.status(200).send('course uploaded and saved');
                                console.log(result);
                        }
                });
                db.query('INSERT INTO photo ( teacher_id, student_id,course_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?), ?,?)',
                        [null, null, course_name, filename, filepath], (insertErr, results) => {
                                if (insertErr) {
                                        console.error('Error inserting photo data:', insertErr);
                                        // res.status(500).send('Internal Server Error');
                                } else {
                                        console.log('photo inserted successfully');
                                        // res.status(200).send('course uploaded and saved');
                                        console.log(results);
                                }
                        })
        }
        catch (error) {
                console.error(error);
                // res.status(500).send({ message: 'An error occurred' });
        }
}
const update = async (req, res) => {
        const { courseName, teacher_name, } = req.body;

        try {
                const result = await db.promise().query(
                        'UPDATE courses SET course_name =? , teacher_id = (SELECT teacher_id from teachers where usename =? )where course_id =?',
                        [courseName, teacher_name, id]
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
        db.query('DELETE FROM courses WHERE  course_id = ?', [id], (err, results) => {
                if (err) {
                        console.error('Error updating courser:', err);
                } else {
                        res.send('Delete successfully');
                        console.log('Delete successfully');
                        console.log(results);
                }
        })
}
const displayAll = async (req, res) => {

        const sqlQuery = 'SELECT c.*, t.username FROM courses c JOIN teachers t WHERE c.teacher_id = t.teacher_id;';

        db.query(sqlQuery, (error, results) => {
                if (error) {
                        console.error('Error executing query:', error);
                        return;
                }
                else {
                        res.send(results);
                }
                console.log(results);
        });
}
const getbyId = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT c.*, t.username, p.filepath FROM courses AS c JOIN teachers AS t JOIN photo p WHERE t.teacher_id=c.teacher_id AND p.course_id =c.course_id AND c.course_id = ?';

        db.query(selectQuery, [id], (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        if (results.length > 0) {
                                const course = results[0];
                                console.log('Course:', course);
                                res.send(results);
                        } else {
                                console.log('Course not found');
                        }
                }
        })
}
const getbyCourse = async (req, res) => {
        const course_name = req.body.course_name;
        const query = 'SELECT *, username FROM courses c join teachers t where c.teacher_id=t.teacher_id AND course_name =? '
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

module.exports = {
        create,
        remove,
        displayAll,
        update,
        getbyId,
        getbyCourse,

}



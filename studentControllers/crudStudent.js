const db = require("../config/db");

const displayAll = async (req, res) => {

        const sqlQuery = 'SELECT * FROM students';

        db.query(sqlQuery, (error, results) => {
                if (error) {
                        console.error('Error executing query:', error);
                }
                else {
                        // console.log(results);
                        res.send(results);
                }
                console.log(results);
        });
}
const getbyId = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT s.*, p.filepath FROM students as s JOIN photo AS p WHERE s.student_id = p.student_id AND s.student_id = ?; ';
        // const selectQuery = 'SELECT * FROM students  WHERE student_id = ?';
        db.query(selectQuery, [id], (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        if (results.length > 0) {
                                const student = results[0];
                                console.log('Student:', student);
                                res.send(results);
                        } else {
                                console.log('Student not found');
                        }
                }
        })
}
const getStudent = async (req, res) => {
        // const id = req.params.id;
        const email = req.body.email;
        const sql = 'SELECT * FROM students WHERE email = ?';
        db.query(sql, [email], (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        if (results.length > 0) {
                                const student = results[0];
                                console.log('Student:', student);
                                res.send(results);
                        } else {
                                console.log('Student not found');
                        }
                }
        })
}
const getbyName = async (req, res) => {
        const name = req.body.name;
        const query = "Select * from students where fullname like '%?%' ";
        db.query(query, [name], (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        if (results.length > 0) {
                                const student = results[0];
                                console.log('Student:', student);
                                res.send(results);
                        } else {
                                console.log('Student not found');
                        }
                }
        })
}
const getbyGeneration = async (req, res) => {
        const generation = req.body.generation;
        const query = 'SELECT * FROM students WHERE generation = ? ';
        db.query(query, [generation], (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        if (results.length > 0) {
                                const student = results[0];
                                console.log('Student:', student);
                                res.send(results);
                        } else {
                                console.log('Student not found');
                        }
                }
        })
}
const update = async (req, res) => {
        const id = req.params.id;
        const { username,first_name, last_name,email, password, gender,generation } = req.body;
        db.query('Update students SET fullname =?, gender=?, address=?, email=?,phone=?  WHERE  id = ? ', [username,first_name, last_name,email, password, gender,generation , id], (err, results) => {
                if (err) {
                        console.error('Error updating student:', err);
                } else {
                        console.log('Student updated successfully');
                        res.send('Student updated successfully')
                        console.log(results);
                }
        })

}

const remove = async (req, res) => {
        const id = req.params.id;
    
        db.query('SET FOREIGN_KEY_CHECKS=0;', (err) => {
            if (err) {
                console.error('Error disabling foreign key checks:', err);
            } else {
                db.query('DELETE FROM `students` WHERE `student_id` = ? LIMIT 10 ;', [id], (err, results) => {
                    if (err) {
                        console.error('Error deleting student:', err);
                    } else {
                        console.log('Student deleted successfully');
                        res.status(200).send('Student deleted successfully!');
                        console.log(results);
                    }
                    db.query('SET FOREIGN_KEY_CHECKS=1;', (err) => {
                        if (err) {
                            console.error('Error enabling foreign key checks:', err);
                        }
                    });
                });
            }
        });
    };
    

module.exports = {
        displayAll,
        getbyId,
        getbyName,
        getbyGeneration,
        update,
        remove,
        getStudent

}
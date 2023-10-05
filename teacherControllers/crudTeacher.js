const db = require('../config/db');

const DisplayAll = async (req, res) => {

        const sqlQuery = 'SELECT * FROM teachers';

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
const getById = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT * FROM teachers  WHERE teacher_id= ?';
        const sql = 'SELECT  t.*, p.filepath FROM teachers t JOIN photo p WHERE t.teacher_id = p.teacher_id AND t.teacher_id= ?;';

        db.query(selectQuery, [id], (err, results) => {
                if (err) {
                        console.error('Error fetching teacher:', err);
                }
                else {
                        if (results.length > 0) {
                                db.query(sql, [id], (err, results) => {
                                        if (err) {
                                                console.error('Error fetching teacher:', err);
                                        }
                                        else {
                                                if (results.length > 0) {

                                                        const teacher = results[0];
                                                        console.log('Teacher:', teacher);
                                                        res.send(results);
                                                } else {
                                                        console.log('Teacher not found');
                                                }
                                        }
                                })
                        } else {
                                console.log('Teacher not found');
                        }
                }
        });




}
const getByName = async (req, res) => {
        const name = req.body.username;
        const query = "Select * from teachers where username = ?  ";
        db.query(query, [name], (err, results) => {
                if (err) {
                        console.error('Error fetching teacher:', err);
                }
                else {
                        if (results.length > 0) {
                                const teacher = results[0];
                                console.log('Teacher:', teacher);
                                res.send(results);
                        } else {
                                console.log('Teacher not found');
                        }
                }
        })
}

        const update = async (req, res) => {
        const id = req.body.id;
        const email = req.body.email;
        const gender = req.body.gender;
        const address = req.body.address;
        const username = req.body.username;
        const phone_number = req.body.phone_number;
        const password = req.body.password;
        db.query('Update teachers SET email = ?, gender = ?, address = ?, username = ?, phone_number = ?, password = ?,  id = ?', [email, gender, address, username, phone_number, password, id], (err, results) => {
                if (err) {
                        console.error('Error updating student:', err);
                } else {
                        console.log('Teacher updated successfully');
                        console.log(results);
                }
        })
}
const remove = async (req, res) => {
        const id = req.params.id;
        const removeTeacher = `DELETE FROM teachers WHERE teacher_id = ?`;
        db.query(removeTeacher, [id], (err, result) => {
                if (err) {
                        console.error(" Teacher remove Error.", err);
                } else {
                        console.log("Removed sucessfully.", result);
                        res.send("Teacher remove sucessfully.")
                }
        })
}
module.exports = {
        DisplayAll,
        update,
        remove,
        getById,
        getByName,
        

}  
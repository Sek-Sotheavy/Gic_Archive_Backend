const db = require('../config/db');
const fs = require('fs');
const path = require('path');


const create = async (req, res) => {

        // const pdfFilePath = req.file.path;
        const { role_name, descr } = req.body;
        const query = 'INSERT INTO roles(role_name, descr) VALUES (?,?);';

        db.query(query, [role_name, descr], (insertErr, results) => {
                if (insertErr) {
                        console.error('Create role :', insertErr);
                        res.status(500).send('Internal Server Error');
                } else {
                        console.log('Role create successfully');
                        res.status(200).send('Role create successfully');
                        console.log(results);
                }
        });
}
const update = async (req, res) => {
        const id = req.params.id;
        // const course_name = req.body.id;
        const { role_name, descr } = req.body;

        try {
                const result = await db.promise().query(
                        'UPDATE roles SET role_name =? , descr =? where role_id = ?;   ',
                        [role_name, descr, id]
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
        db.query('DELETE FROM roles WHERE  role_id = ?', [id], (err, results) => {
                if (err) {
                        console.error('Error delete role:', err);
                } else {
                        res.send('Delete successfully');
                        console.log('Delete successfully');
                        console.log(results);
                }
        })
}
const displayAll = async (req, res) => {

        const sqlQuery = 'SELECT * FROM roles;';

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
        const selectQuery = 'select * from roles where role_id = ?';

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
module.exports = {
        create,
        remove,
        displayAll,
        update,
        getbyId
}
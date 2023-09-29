const db = require('../config/db');

const create = async (req, res) => {

}

const display = async (req, res) => {
        const id = req.params.id;
        const query = 'select filepath from photo p join students s where p.student_id = s.student_id AND s.student_id =?';
        db.query(query, [id], (err, results) => {
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
module.exports = {
        create,
        display,
}
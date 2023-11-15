const db = require('../config/db');

const create = async (req, res) => {
        const id = req.params.id;
        const { title, course_id, descr, github_url } = req.body;


}
const display = async (req, res) => {
        const id = req.params.id;
        const sql = 'SELECT c.*, CONCAT(t.first_name, " ", t.last_name) AS fullname, t.username FROM courses c JOIN teachers t ON t.teacher_id = c.teacher_id WHERE t.teacher_id = ?'
        db.query(sql, [id], (Err, result) => {
                if (Err) {
                        console.error('Error inserting course:', Err);
                        res.status(500).send('Internal Server Error');
                } else {
                        console.log('course create successfully');
                        res.json({ message: 'Update successful', updatedData: { result } });
                        // res.status(200).send('course uploaded and saved', result);
                        console.log(result);
                }
        })
}
module.exports = {
        create,
        display

}
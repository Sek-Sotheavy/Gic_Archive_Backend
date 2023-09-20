const db = require('../config/db');

const create = async (req, res) => {
        const { project_id, student_id, liked, project_name, username } = req.body;

        db.query('INERT INTO rating(project_id,student_id, liked) VALUES ((SELECT project_name FROM classTeam_project WHERE project_name =? ),(SELECT student_id FROM students WHERE username =?),?,?)',
                [project_id, student_id, liked, project_name, username])
        if (err) {
                console.error('Error create project:', err);
        } else {
                console.log('Rating successfully');
                res.send('Rating successfully');
                console.log(results);
        }
}
const remove = async (req, res) => {
        const id = req.params.id;
        db.query('DELETE FROM raitng WHERE  rating_id = ?', [id], (err, results) => {
                if (err) {
                        console.error('Error delete rating:', err);
                } else {
                        console.log('Rating delete successfully');
                        res.send('Rating delete successfully');
                        console.log(results);
                }
        })
}
module.exports = {
        create,
        remove

}
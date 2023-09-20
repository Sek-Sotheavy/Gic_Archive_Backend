const db = require('../config/db');

const addMember = (req, res) => {
        const { username, title } = req.body;
        db.query('SELECT c.*, s.username, co.course_name  FROM classteam_project AS c JOIN students AS s JOIN classteamproject_member AS cl JOIN courses co WHERE c.project_id = cl.project_id AND s.student_id = cl.student_id AND c.course_id = co.course_id;', [title, username], (err, results) => {
                if (err) {
                        console.error('Error add member:', err);
                } else {
                        console.log('Add member successfully');
                        res.send('Add member successfully');
                        console.log(results);
                }
        })
}
const showMember = (req, res) => {
        db.query('SELECT title,username from classTeamProject_member as cl join students as s join classTeam_project as c WHERE c.project_id = cl.project_id AND cl.student_id = s.student_id; ', (err, results) => {
                if (err) {
                        console.error('Error fetching team project:', err);
                }
                else {
                        res.send(results);
                }
                console.log(results);
        });
}

module.exports = {
        addMember,
        showMember
}
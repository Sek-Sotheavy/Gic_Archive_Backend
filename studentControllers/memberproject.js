const db = require('../config/db');

const addMember = (req, res) => {
        const { username, title } = req.body;
        const id = req.params.project_id;
        db.query('INSERT INTO classteamproject_member (project_id, student_id) VALUES ((SELECT project_id from classTeam_project where project_id =?),(SELECT student_id FROM students WHERE username = ? ))', [id, username], (err, results) => {
                if (err) {
                        console.error('Error add member:', err);
                }
                else {
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
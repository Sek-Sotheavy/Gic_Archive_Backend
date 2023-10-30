const db = require('../config/db');

const addMember = (req, res) => {
        const username = req.body.username;
        const id = req.params.id;

        db.query('INSERT INTO classteamproject_member (project_id, student_id) VALUES (?,(SELECT student_id FROM students WHERE username = ? ))',
                [id, username], (err, results) => {
                        if (err) {
                                console.error('Student not found:', err);
                        }
                        else {
                                console.log('Add member successfully');
                                res.send('Add member successfully');
                                console.log(results);
                        }
                });

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
const CountMember = async (req, res) => {
        const sql = 'SELECT COUNT(*) AS member FROM classteamproject_member m JOIN classteam_project cl ON cl.project_id = m.project_id ';
        db.query(sql, (err, results) => {
                if (err) {
                        console.error('Error fetching team member project:', err);
                }
                else {
                        res.send(results);
                }
                console.log(results);
        });
}

module.exports = {
        addMember,
        showMember, CountMember
}
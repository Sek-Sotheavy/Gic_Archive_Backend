const db = require('../config/db');
const moment = require('moment');
const { validationResult } = require('express-validator');

const create = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { comment_id, project_id, thesis_id,student_id, comment_text } = req.body;
  
  try {

        const timestamp = moment(Date()).format("YYYY-MM-DD hh:mm:ss AM/PM");
    const result = await db.promise().query(
      'INSERT INTO comments (comment_id, project_id, thesis_id, student_id, comment_text, timestamp) VALUES (?,(SELECT  project_id From classTeam_project WHERE project_id = ?), (SELECT  thesis_id From thesis WHERE thesis_id = ?),?,?,?)',
      [comment_id, project_id,thesis_id, student_id, comment_text, timestamp]
    );

    console.log(result);
    res.json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the comment' });
  }
};

const update = async (req, res) => {
    const id = req.params.id;
    const {project_id, thesis_id,student_id, comment_text } = req.body;
    const timestamp = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
    db.query('Update comments SET project_id = ?,thesis_id = ?, student_id = ? ,comment_text = ?, timestamp = ? WHERE  comment_id = ?', 
    [project_id,thesis_id, student_id, comment_text, timestamp ,id], (err, results) => {
        if (err) {
                console.error('Error updating role:', err);
        } else {
                console.log('comment updated successfully');
                res.send('comment updated successfully')
                console.log(results);
        }              
        
})
}
const remove = async (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM comments WHERE  comment_id = ?', [id], (err, results) => {
          if (err) {
                  console.error('Error updating comment:', err);
          } else {
                  res.send('Delete successfully');
                  console.log('Delete successfully');
                  console.log(results);
          }
  }) 
}
const displayAll = async (req, res) => {

  const sqlQuery = 'SELECT * FROM comments';

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
  const selectQuery = 'SELECT * FROM comments WHERE comment_id= ?';

  db.query(selectQuery, [id], (err, results) => {
          if (err) {
                  console.error('Error fetching comment:', err);
          }
          else {
                  if (results.length > 0) {
                          const course = results[0];
                          console.log('Course:', course);
                          res.send(results);
                  } else {
                          console.log('Comment not found');
                  }
          }
  })
}
module.exports = {
    create,
    update,
    remove,
    displayAll,
    getbyId
}
const db = require('../config/db');
const moment = require('moment');
const { validationResult } = require('express-validator');

const create = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        const { project_id, thesis_id, comment_text, student_id  } = req.body;
      
        try {
          const timestamp = moment(Date()).format("YYYY-MM-DD hh:mm:ss AM/PM");

          const result = await db.promise().query(
            'INSERT INTO comments (project_id, thesis_id, student_id, comment_text, timestamp) VALUES (?, ?, ?, ?, ?)',
            [project_id, thesis_id, student_id, comment_text, timestamp]
          );
      
          console.log(result);
          res.json({ message: 'Comment created successfully'});
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
  const comment_id = req.params.comment_id;
  db.query('DELETE FROM comments WHERE  comment_id = ?', [comment_id], (err, results) => {
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
                //   res.send(results);
          }
        //   console.log(results);
  });
}
const getbyId = async (req, res) => {
        const id = req.params.id;
        const selectQuery = 'SELECT * FROM comments WHERE project_id = ?';
      
        db.query(selectQuery, [id], (err, results) => {
          if (err) {
            console.error('Error fetching comments:', err);
        //     res.status(500).json({ message: 'Error fetching comments' });
          } else {
            if (results.length > 0) {
              console.log('Comments:', results[0]);
              res.send(results);
            } else {
              console.log('No comments found');
              res.status(404).json({ message: 'No comments found for the project_id' });
            }
          }
        });
};

const getbytheisId = async (req, res) => {
        const thesisid = req.params.thesisid;
        const selectQuery = 'SELECT c.*,s.username, filepath FROM comments c JOIN students s ON c.student_id = s.student_id JOIN photo p ON p.student_id = c.student_id WHERE c.thesis_id = ?;';
        // SELECT c.*, username FROM comments c JOIN students s ON c.student_id = s.student_id WHERE s.student_id = ?
        // SELECT * FROM comments WHERE thesis_id = ?
        db.query(selectQuery, [thesisid], (err, results) => {
          if (err) {
            console.error('Error fetching comments:', err);
          } else {
            if (results.length > 0) {
              console.log('Comments:', results[0]);
              res.send(results);
            } else {
              console.log('No comments found');
              res.status(404).json({ message: 'No comments found for the thesis' });
            }
          }
        });
};
      
module.exports = {
    create,
    update,
    remove,
    displayAll,
    getbyId,
    getbytheisId
}
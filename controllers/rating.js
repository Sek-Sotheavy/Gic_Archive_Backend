const db = require("../config/db");
const moment = require("moment");
const { validationResult } = require("express-validator");

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating_id, project_id, thesis_id, student_id,teacher_id, liked} = req.body;
  // const liked = req.body;

  try {
    const timestamp = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
    const result = await db.promise().query(
      "INSERT INTO ratings ( rating_id, project_id, thesis_id, student_id, teacher_id, liked, timestamp) VALUES (?,?,?,?,?,?,?)",
      [rating_id, project_id, thesis_id, student_id,teacher_id, liked, timestamp]
    );

    console.log(result);
    res.json({ message: "Rating created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the rating" });
  }
};
const update = async (req, res) => {
  const id = req.params.id;
  const { project_id, student_id, liked } = req.body;
  const timestamp = moment(Date()).format("YYYY-MM-DD hh:mm:ss AM/PM");
  db.query(
    "Update ratings SET  project_id= ?, student_id = ?, liked = ? , timestamp= ? WHERE  rating_id = ?",
    [project_id, student_id, liked, timestamp],
    (err, results) => {
      if (err) {
        console.error("Error updating role:", err);
      } else {
        console.log("rating updated successfully");
        res.send("rating updated successfully");
        console.log(results);
      }
    }
  );
};
const remove = async (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM ratings WHERE  rating_id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error updating courser:", err);
    } else {
      res.send("Delete successfully");
      console.log("Delete successfully");
      console.log(results);
    }
  });
};
const displayAll = async (req, res) => {
  const sqlQuery = "SELECT * FROM ratings";

  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    } else {
      res.send(results);
    }
    console.log(results);
  });
};
const getbyId = async (req, res) => {
  const id = req.params.id;
  const selectQuery = "SELECT * FROM ratings WHERE rating_id= ?";

  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching student:", err);
    } else {
      if (results.length > 0) {
        const course = results[0];
        console.log("Rating:", course);
        res.send(results);
      } else {
        console.log("Rating not found");
      }
    }
  });
};

const getLike = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT COUNT(*) as countlike FROM ratings WHERE project_id = ? AND Liked = " 1 " ';
  db.query(query, [id], (err, results) => {
          if (err) {
                  console.error('Error fetching Like:', err);
          }
          else {
                  if (results.length > 0) {
                          const Like = results[0].countlike;
                          console.log('ProjectLike:', Like);
                          res.send(results);
                  } else {
                          console.log('Gender not found');
                  }
          }
  })
}

const getthesisLike = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT COUNT(*) as countlike FROM ratings WHERE thesis_id = ? AND Liked = " 1 "';
  db.query(query, [id], (err, results) => {
          if (err) {
                  console.error('Error fetching Like:', err);
          }
          else {
                  if (results.length > 0) {
                          const Like = results[0].countlike;
                          console.log('ThesisLike:', Like);
                          res.send(results);
                  } else {
                          console.log('Gender not found');
                  }
          }
  })
}
module.exports = {
  create,
  update,
  remove,
  displayAll,
  getbyId,
  getLike,
  getthesisLike
};

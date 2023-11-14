const db = require("../config/db");
const bcrypt = require("bcrypt");

const DisplayAll = async (req, res) => {
  const sqlQuery = "SELECT * FROM teachers ";

  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    } else {
      res.send(results);
      // console.log(results);
    }
  });
};
const getById = async (req, res) => {
  const id = req.params.id;
  const selectQuery = "SELECT * FROM teachers  WHERE teacher_id= ?";
  const sql =
    "SELECT  t.*, p.filepath FROM teachers t JOIN photo p WHERE t.teacher_id = p.teacher_id AND t.teacher_id= ?;";

  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching teacher:", err);
    } else {
      if (results.length > 0) {
        db.query(sql, [id], (err, results) => {
          if (err) {
            console.error("Error fetching teacher:", err);
          } else {
            if (results.length > 0) {
              const teacher = results[0];
              console.log("Teacher:", teacher);
              res.send(results);
            } else {
              console.log("Teacher not found");
            }
          }
        });
      } else {
        console.log("Teacher not found");
      }
    }
  });
};
const getByName = async (req, res) => {
  const name = req.body.username;
  const query = "Select * from teachers where username = ?  ";
  db.query(query, [name], (err, results) => {
    if (err) {
      console.error("Error fetching teacher:", err);
    } else {
      if (results.length > 0) {
        const teacher = results[0];
        console.log("Teacher:", teacher);
        res.send(results);
      } else {
        console.log("Teacher not found");
      }
    }
  });
};
const update = async (req, res) => {
  const id = req.params.id;
  const { username, first_name, last_name, email, password, gender } = req.body;
  const filename = req.file.originalname;
  const filepath = req.file.path;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "UPDATE teachers SET username = ?, first_name = ?, last_name = ?, email = ?, password = ?,role_id = ?, gender = ? WHERE teacher_id = ?",
      [username, first_name, last_name, email, hashedPassword, 1, gender, id]
    );
    db.query(
      "UPDATE photo SET file_name = ?, filepath = ? WHERE teacher_id = (SELECT teacher_id FROM teachers WHERE username = ?) AND course_id = (SELECT course_id FROM courses WHERE course_name = ?) AND student_id = (SELECT student_id FROM courses WHERE student_id = ?) AND student_id = (SELECT project_id FROM class WHERE student_id = ?) ;",
      [filename, filepath, username, null, null]
    );
    res.json({ message: "Teacher updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  db.query("SET FOREIGN_KEY_CHECKS=0;", (err) => {
    if (err) {
      console.error("Error disabling foreign key checks:", err);
    } else {
      db.query(
        "DELETE FROM `teachers` WHERE `teacher_id` = ? LIMIT 10 ;",
        [id],
        (err, results) => {
          if (err) {
            console.error("Error deleting teacher:", err);
          } else {
            console.log("teacher deleted successfully");
            res.status(200).send("teacher deleted successfully!");
            console.log(results);
          }
          db.query("SET FOREIGN_KEY_CHECKS=1;", (err) => {
            if (err) {
              console.error("Error enabling foreign key checks:", err);
            }
          });
        }
      );
    }
  });
};
module.exports = {
  DisplayAll,
  update,
  remove,
  getById,
  getByName,
};

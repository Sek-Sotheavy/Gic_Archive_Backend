const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const filename = req.file.originalname;
  const filepath = req.file.path;
  const {username,email,gender,password,first_name,last_name,generation,} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO students(username ,first_name , last_name, email, password,role_id , gender, generation) VALUES ( ?, ?,?, ?,?,?,?,?)";
    await db.promise().query(query, [username,first_name,last_name,email,hashedPassword,2,gender,generation]);
    db.query(
      "INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)",
      [null, username, null, null, null, filename, filepath],
      (insertErr, results) => {
        if (insertErr) {
          console.error("Error inserting photo data:", insertErr);
        } else {
          console.log("photo inserted successfully");
          console.log(results);
        }
      }
    );
    const sql =
      "INSERT INTO users (student_id, teacher_id , role_id) VALUES ((SELECT student_id from students where username =?), ?, ?)";
    db.query(sql, [username, null, 2]);
    return res.status(200).send("Student registered successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  // login,
  signup,
};

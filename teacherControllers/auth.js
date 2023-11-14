const db = require("../config/db");
const bcrypt = require("bcrypt");
const signup = async (req, res) => {
  const filename = req.file.originalname;
  const filepath = req.file.path;
  const { first_name, last_name, username, email, password, gender } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO teachers (username, first_name, last_name, email, password, role_id, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, first_name, last_name, email, hashedPassword, 1, gender]
    );
    db.query(
      "INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)",
      [username, null, null, null, null, filename, filepath],
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
      "INSERT INTO users (student_id, teacher_id , role_id) VALUES (?,(SELECT teacher_id from teachers where username =?),  ?)";
    db.query(sql, [null, username, 1]);
    res.json({ message: "Teacher registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
module.exports = {
  signup,
};

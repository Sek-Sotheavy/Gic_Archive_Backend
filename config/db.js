require("dotenv").config();

const mysql = require('mysql2');

const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
});
db.connect(function (error) {
        if (error) throw error;
        console.log("Connected!");
});
db.query('CREATE DATABASE IF NOT EXISTS  gic_archive ', (createErr) => {
        if (createErr) {
                console.error('Error creating the database:', createErr);
                return;
        }

});
db.query('use gic_archive ');

db.query('CREATE TABLE IF NOT EXISTS students(student_id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), role_id INT ,gender VARCHAR(255), generation VARCHAR(255), FOREIGN KEY(role_id) REFERENCES roles(role_id) ) ', (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});
db.query('CREATE TABLE IF NOT EXISTS teachers(teacher_id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), role_id INT , gender VARCHAR(255), FOREIGN KEY (role_id) REFERENCES roles(role_id) ) ', (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});
db.query('CREATE TABLE IF NOT EXISTS roles(role_id INT PRIMARY KEY AUTO_INCREMENT, role_name VARCHAR(255), descr VARCHAR(255) ) ', (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});
db.query("CREATE TABLE IF NOT EXISTS courses (course_id INT PRIMARY KEY AUTO_INCREMENT, course_name VARCHAR(255), teacher_id INT, FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id ))", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }
});
db.query("CREATE TABLE IF NOT EXISTS documents(doc_id INT PRIMARY KEY AUTO_INCREMENT, fileName VARCHAR(255), filepath VARCHAR(255), filetype VARCHAR(50), upload_date DATETIME)", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});
db.query('CREATE TABLE IF NOT EXISTS thesis (thesis_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255), student_id INT,teacher_id INT, descr TEXT, field VARCHAR(255), company VARCHAR(255), tags VARCHAR(255), github_url VARCHAR(255), doc_id INT ,  FOREIGN KEY (doc_id) REFERENCES documents(doc_id),FOREIGN KEY (student_id) REFERENCES students(student_id),FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id))', (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }
        else {
                console.log('Table created successfully');
        }
});
db.query('CREATE TABLE IF NOT EXISTS classTeam_project( project_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255), course_id INT, descr TEXT, github_url VARCHAR(255), doc_id  INT,  FOREIGN KEY (doc_id) REFERENCES documents(doc_id)) ', (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});
db.query("CREATE TABLE IF NOT EXISTS photo(photo_id INT PRIMARY KEY AUTO_INCREMENT, teacher_id INT , student_id INT , course_id INT,  project_id INT , thesis_id INT, file_name VARCHAR(255), filepath VARCHAR(255), FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),FOREIGN KEY (student_id) REFERENCES students(student_id), FOREIGN KEY (course_id) REFERENCES courses(course_id),FOREIGN KEY (project_id) REFERENCES classTeam_project(project_id),FOREIGN KEY (thesis_id) REFERENCES thesis(thesis_id))", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});
db.query("CREATE TABLE IF NOT EXISTS classTeamProject_member (member_id INT PRIMARY KEY AUTO_INCREMENT, project_id INT, student_id INT, FOREIGN KEY (project_id) REFERENCES classTeam_project(project_id),FOREIGN KEY (student_id) REFERENCES students(student_id))", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }
        else {
                console.log('Table created successfully');
        }
});


db.query("CREATE TABLE IF NOT EXISTS ratings(rating_id INT PRIMARY KEY AUTO_INCREMENT , project_id INT ,thesis_id INT, student_id INT, liked TINYINT, Timestamp TIMESTAMP, FOREIGN KEY (project_id) REFERENCES classTeam_project(project_id),FOREIGN KEY (thesis_id) REFERENCES thesis(thesis_id),FOREIGN KEY (student_id) REFERENCES students(student_id))", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});

db.query("CREATE TABLE IF NOT EXISTS users (user_id INT PRIMARY KEY AUTO_INCREMENT , student_id int , teacher_id int, role_id int,  FOREIGN KEY(role_id) REFERENCES roles(role_id),FOREIGN KEY (student_id) REFERENCES students(student_id),FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id))", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }
});
db.query("CREATE TABLE IF NOT EXISTS  comment (comment_id INT PRIMARY KEY AUTO_INCREMENT , project_id INT ,thesis_id INT, student_id INT, comment_text VARCHAR(255), timestamp TIMESTAMP, FOREIGN KEY(project_id) REFERENCES classTeam_project(project_id),FOREIGN KEY(thesis_id) REFERENCES thesis(thesis_id),FOREIGN KEY(student_id) REFERENCES students(student_id))", (createErr) => {
        if (createErr) {
                console.error('Error creating the table:', createErr);
        }

});

module.exports = db;

const db = require('../config/db');

const getCountStudent = async (req, res) => {
        const query = 'SELECT COUNT(*) as studentCount FROM students';
        db.query(query, (err, results) => {
                if (err) {
                        console.error('Error fetching student:', err);
                }
                else {
                        if (results.length > 0) {
                                const student = results[0].studentCount;
                                console.log('StudentCount:', student);
                                res.send(results);
                        } else {
                                console.log('Student not found');
                        }
                }
        })
}

const getCountTeacher = async (req, res) => {
        const query = 'SELECT COUNT(*) as teacherCount FROM teachers';
        db.query(query, (err, results) => {
                if (err) {
                        console.error('Error fetching teacher:', err);
                }
                else {
                        if (results.length > 0) {
                                const Teacher = results[0].teacherCount;
                                console.log('TeacherCount:', Teacher);
                                res.send(results);
                        } else {
                                console.log('Teacher not found');
                        }
                }
        })
}
const getCountCourse = async (req, res) => {
        const query = 'SELECT COUNT(*) as courseCount FROM courses';
        db.query(query, (err, results) => {
                if (err) {
                        console.error('Error fetching course:', err);
                }
                else {
                        if (results.length > 0) {
                                const course = results[0].courseCount;
                                console.log('courseCount:', course);
                                res.send(results);
                        } else {
                                console.log('course not found');
                        }
                }
        })
}
const getFemale = async (req, res) => {
        const query = 'SELECT COUNT(*) as girl FROM students WHERE gender = "female"OR gender = "F"';
        db.query(query, (err, results) => {
                if (err) {
                        console.error('Error fetching gender:', err);
                }
                else {
                        if (results.length > 0) {
                                const female = results[0].girl;
                                console.log('FemaleCount:', female);
                                res.send(results);
                        } else {
                                console.log('Gender not found');
                        }
                }
        })
}
const getMale = async (req, res) => {
        const query = 'SELECT COUNT(*) as boy FROM students WHERE gender = "male " OR gender = "M"';
        db.query(query, (err, results) => {
                if (err) {
                        console.error('Error fetching gender:', err);
                }
                else {
                        if (results.length > 0) {
                                const male = results[0].boy;
                                console.log('MaleCount:', male);
                                res.send(results);
                        } else {
                                console.log('Gender not found');
                        }
                }
        })
}

module.exports = {
        getCountCourse,
        getCountStudent,
        getCountTeacher,
        getFemale,
        getMale
}
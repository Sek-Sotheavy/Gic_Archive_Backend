const express = require("express");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const db = require("../config/db");
const student = require("../studentControllers/auth");
const studentList = require("../studentControllers/crudStudent");
const teacher = require("../teacherControllers/auth");
const { signUpSchema, signInSchema } = require("../schemas");
const teachers = require("../teacherControllers/crudTeacher");
const comment = require("../controllers/comment");
const con = require("../controllers/auth");
const thesis = require("../studentControllers/Thesis");
const course = require("../controllers/course");
const project = require("../studentControllers/team_project");
const rating = require("../controllers/rating");
const photo = require("../controllers/photo");
const role = require("../controllers/role");
const member = require("../studentControllers/memberproject");
const dashboard = require("../controllers/dashboard");
const auth = require("../middleware/auth");
const courseTeacher = require('../teacherControllers/course');
const adminThesis = require("../controllers/thesis");
const teacherProject = require('../teacherControllers/project');
const teacherThesis = require('../teacherControllers/thesis');
const joiValidation = require("../middleware/joiValidation");

const moment = require("moment");

const router = express.Router();
// const multer = require("multer");
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                if (file.fieldname === "image") {
                        cb(null, "images");
                } else if (file.fieldname === "file") {
                        cb(null, "uploads");
                }
        },
        filename: (req, file, cb) => {
                cb(null, file.originalname);
        },
});
const upload = multer({ storage: storage });

//
router.use(cookieParser());
router.get('/me', auth.checkUserLoggedIn, (req, res) => {
        try {
                // console.log(req.user.id);
                console.log(req.filepath);
                return res.status(200).json({
                        status: "Success",
                        id: req.user.id,
                        teacher_id: req.user.teacher_id,
                        first_name: req.user.first_name,
                        last_name: req.user.last_name,
                        email: req.user.email,
                        name: req.user.name,
                        gender: req.user.gender,
                        generation: req.user.generation,
                        role_name: req.user.role_name,
                        filepath: req.user.filepath
                });
        } catch (error) {
                console.error('Error:', error);
                return res.status(500).json({
                        status: 'Error',
                        message: 'Internal server error'
                });
        }
});
router.post('/login', con.login, auth.ensureSignedOut, joiValidation(signInSchema));
router.post('/admin/signup/teacher', upload.single('image'), teacher.signup);
router.post('/admin/signup/student', upload.single('image'), student.signup);
router.post('/logout', async (req, res, next) => {
        // sessionStorage.removeItem("token");
        return res.json({ status: "Success" });
})
//student 
router.get('/admin/student/all', studentList.displayAll);
router.get('/admin/student/:id', studentList.getbyId);
router.post('/admin/student/all/name', studentList.getbyName);
router.post('/admin/admin/student/all/generation', studentList.getbyGeneration);
router.post('/admin/student/delete/:id', studentList.remove);
router.post('/admin/student/update/:id', studentList.update);

// router.get('/getstudent', studentList.getStudent);

//teacher-
router.get("/admin/teacher/all", teachers.DisplayAll);
router.post(
        "/admin/teacher/update/:id",
        upload.single("image"),
        teachers.update
);
router.post("/admin/teacher/delete/:id", teachers.remove);
router.get("/admin/teacher/:id", teachers.getById);
router.post("/admin/teacher/all/name", teachers.getByName);

//file
// router.use(upload_file());
router.get("/admin/teacher/update/:id", (req, res) => {
        res.sendFile(__dirname + "/index.html");
});
//thesis

router.post("/admin/thesis/create", upload.fields([{ name: "file", maxCount: 1 }, { name: "image", maxCount: 1 },]), async (req, res) => {
        const { title, username, descr, field, company, tags, github_url, teacher_name, } = req.body;
        const file = req.files["file"][0]; // Assuming 'file' is the field name
        const image = req.files["image"][0]; // Assuming 'image' is the field name

        // Access file properties
        const fileMimetype = file.mimetype;
        const filePath = file.path;
        const filename = file.originalname;
        // Access image properties
        const imageName = image.originalname;
        const imagePath = image.path;
        const date = moment().format("YYYY-MM-DD hh:mm:ss");
        try {
                db.query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, filePath, fileMimetype, date]
                );
                db.query(
                        'INSERT INTO thesis(title, student_id,teacher_id ,descr, field, company, tags, github_url, doc_id) VALUES (?,(SELECT student_id FROM students WHERE username =? ),(SELECT teacher_id FROM teachers WHERE username =? ),?,?,?,?,?,(SELECT doc_id FROM documents WHERE filepath =? limit 1))',
                        [title, username, teacher_name, descr, field, company, tags, github_url, filePath]);

                await db.promise().query('INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)',
                        [null, null, null, null, title, imageName, imagePath]);
                res.json({ message: 'Thesis Create successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
});

router.get('/admin/thesis/all', adminThesis.displayThesis);
router.get('/admin/thesis/all/:id', adminThesis.displayById);
router.post('/admin/thesis/all/field', adminThesis.SearchbyField);
router.post('/admin/thesis/delete/:id', adminThesis.remove);
router.get('/admin/thesis/:field', adminThesis.displayField)

//course
router.get('/course/all', course.displayAll);
router.get('/course/:id', course.getbyId);
router.post('/course/create', upload.single('image'), course.create);
router.post('/course/remove/:id', course.remove);
router.post('/course/update/:id', course.update);
router.post('/search/course', course.getbyCourse);

//role
router.get("/role/all", role.displayAll);
// router.get('/role/:id', role.getbyId);
router.post("/role/create", role.create);
router.post("/role/remove/:id", role.remove);
router.post("/role/update/:id", role.update);

//project

router.post("/admin/project/create", upload.fields([{ name: "file", maxCount: 1 }, { name: "image", maxCount: 1 },]), async (req, res) => {
        const { title, descr, course_name, github_url, username } = req.body;
        const file = req.files["file"][0]; // Assuming 'file' is the field name
        const image = req.files["image"][0]; // Assuming 'image' is the field name

        // Access file properties
        const fileMimetype = file.mimetype;
        const filePath = file.path;
        const filename = file.originalname;

        // Access image properties
        const imageName = image.originalname;
        const imagePath = image.path;
        const id = req.params.id;
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
        try {
                db.query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, filePath, fileMimetype, date]
                );
                console.log(id);
                db.query(
                        'INSERT INTO classTeam_project (title, course_id, descr ,github_url, doc_id) VALUES (?,(SELECT course_id FROM courses WHERE course_name =?),?,?,(SELECT doc_id FROM documents WHERE filepath = ? limit 1))',
                        [title, course_name, descr, github_url, filePath], (err, results) => {
                                if (err) {
                                        console.error('class projet not found:', err);
                                }
                                else {
                                        console.log('create successfully');
                                        res.send('create successfully');
                                        console.log(results);
                                }
                        })

                await db.promise().query('INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)',
                        [null, null, null, title, null, imageName, imagePath]);
                const sql = "INSERT INTO classteamproject_member (project_id, student_id) VALUES ((Select project_id from classteam_project where title = ? ),(SELECT student_id FROM students WHERE username = ? ))";
                db.query(sql, [title, username], (err, results) => {
                        if (err) {
                                console.error('Student not found:', err);
                        }
                        else {
                                console.log('Add member successfully');
                                res.send('Add member successfully');
                                console.log(results);
                        }
                });
                // res.json({ message: 'Thesis Create successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
});

router.get("/admin/project/all", project.displayAll);
// router.post('/admin/project/create', upload.single('file'), project.create)
router.post('/admin/project/update/:id', project.update);
router.post('/admin/project/delete/:id', project.remove);
router.get('/admin/project/:id', project.displayByid);
router.post('/admin/project/all/bycourse', project.getbyCourse);
router.get('/admin/project/all/:course_name', project.displayFilter);
router.post('/project/addMember/:id', member.addMember);
router.get('/project/member', member.CountMember);

//comment
router.post("/comment/create", comment.create);
router.post("/comment/update/:id", comment.update);
router.post("/comment/delete/:comment_id", comment.remove);
router.get("/comment/project/:id", comment.getbyprojectId);
router.get("/comment/thesis/:thesisid", comment.getbythesisId);
router.get("/comment/all", comment.displayAll);

//rating
router.post("/like", rating.create);
router.get("/countlike/:id", rating.getLike); //use for project
router.get("/thesisliked/:id", rating.getthesisLike); //use for thesis
router.get("/like/:id", rating.getbyId);

// admin dashboard
router.get("/getCourseCount", dashboard.getCountCourse);
router.get("/getTeacherCount", dashboard.getCountTeacher);
router.get("/getstudentCount", dashboard.getCountStudent);
router.get("/getFemaleCount", dashboard.getFemale);
router.get("/getMaleCount", dashboard.getMale);
router.get("/getThesisCount", dashboard.getCountThesis);
router.get("/getProjectCount", dashboard.getCountProject);
// photo
router.post("/upload/photo", upload.single("image"), photo.create);

// student

router.get("/student/thesis/:id", thesis.display);
router.get('/student/getTeacher', thesis.displayteacher);
router.get("/student/project/:id", project.displayByName);
router.post("/student/thesis/create/:id"), upload.fields([{ name: "file", maxCount: 1 }, { name: "image", maxCount: 1 },]), async (req, res) => {
        const { title, username, descr, field, company, tags, github_url, teacher_name, } = req.body;
        const file = req.files["file"][0]; // Assuming 'file' is the field name
        const image = req.files["image"][0]; // Assuming 'image' is the field name

        // Access file properties
        const fileMimetype = file.mimetype;
        const filePath = file.path;
        const filename = file.originalname;
        const id = req.params.id;
        console.log(id);
        // Access image properties
        const imageName = image.originalname;
        const imagePath = image.path;
        const date = moment().format("YYYY-MM-DD hh:mm:ss");
        try {
                db.query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, filePath, fileMimetype, date]
                );
                db.query(
                        'INSERT INTO thesis(title, student_id,teacher_id ,descr, field, company, tags, github_url, doc_id) VALUES (?,?,(SELECT teacher_id FROM teachers WHERE username =? ),?,?,?,?,?,(SELECT doc_id FROM documents WHERE filepath =? limit 1))',
                        [title, id, teacher_name, descr, field, company, tags, github_url, filePath]);

                await db.promise().query('INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)',
                        [null, null, null, null, title, imageName, imagePath]);
                // res.json({ message: 'Thesis Create successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
};




// router.get('/student/thesis/:name', thesis.display);

// teacher dashboard
router.get('/teacher/courses/:name', course.getbyTeacher);
router.post('/teacher/course/create/:id', courseTeacher.create);
router.get('/teacher/project/:id', teacherProject.Displayproject);
router.get('/teacher/course/display/:id', courseTeacher.display);
router.get('/teacher/thesis/display/:id', teacherThesis.DisplayThesis);

router.post('/teacher/project/create/:id', upload.fields([{ name: "file", maxCount: 1 }, { name: "image", maxCount: 1 },]), async (req, res) => {
        const { title, descr, course_name, github_url, username } = req.body;
        const file = req.files["file"][0]; // Assuming 'file' is the field name
        const image = req.files["image"][0]; // Assuming 'image' is the field name

        // Access file properties
        const fileMimetype = file.mimetype;
        const filePath = file.path;
        const filename = file.originalname;

        // Access image properties
        const imageName = image.originalname;
        const imagePath = image.path;
        const id = req.params.id;
        const date = moment(Date()).format("YYYY-MM-DD hh:mm:ss");
        try {
                db.query(
                        'INSERT INTO documents(fileName,filepath,filetype,upload_date) VALUES (?,?,?,?)',
                        [filename, filePath, fileMimetype, date]
                );
                console.log(id);
                db.query(
                        'INSERT INTO classTeam_project (title, course_id, descr ,github_url, doc_id) VALUES (?,(SELECT course_id FROM courses c join teachers t on t.teacher_id = c.teacher_id WHERE t.teacher =?),?,?,(SELECT doc_id FROM documents WHERE filepath = ? limit 1))',
                        [title, id, descr, github_url, filePath], (err, results) => {
                                if (err) {
                                        console.error('class projet not found:', err);
                                }
                                else {
                                        console.log('create successfully');
                                        res.send('create successfully');
                                        console.log(results);
                                }
                        })

                await db.promise().query('INSERT INTO photo( teacher_id, student_id,course_id,project_id, thesis_id, file_name, filepath) VALUES ((SELECT  teacher_id From teachers WHERE username = ?), (SELECT  student_id From students WHERE username = ?),(SELECT course_id FROM courses where course_name =?),(SELECT project_id FROM classTeam_project WHERE title =?),(SELECT thesis_id FROM thesis where title =?), ?,?)',
                        [null, null, null, title, null, imageName, imagePath]);
                const sql = "INSERT INTO classteamproject_member (project_id, student_id) VALUES ((Select project_id from classteam_project where title = ? ),(SELECT student_id FROM students WHERE username = ? ))";
                db.query(sql, [title, username], (err, results) => {
                        if (err) {
                                console.error('Student not found:', err);
                        }
                        else {
                                console.log('Add member successfully');
                                res.send('Add member successfully');
                                console.log(results);
                        }
                });
                // res.json({ message: 'Thesis Create successfully' });
        }
        catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred' });
        }
});
module.exports = router;

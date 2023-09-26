const express = require('express');
const multer = require('multer');
const student = require('../studentControllers/auth');
const studentList = require('../studentControllers/crudStudent');
const teacher = require('../teacherControllers/auth');
const teachers = require('../teacherControllers/crudTeacher');
const comment = require('../controllers/comment');
const con = require('../controllers/auth');
const thesis = require('../studentControllers/Thesis');
const course = require('../controllers/course');
const project = require('../studentControllers/team_project');
const rating = require('../controllers/rating');
const photo = require('../controllers/photo');
const role = require('../controllers/role');
const member = require('../studentControllers/memberproject');
const doc = require('../studentControllers/document');
const dashboard = require('../controllers/dashboard');

const moment = require('moment');

const router = express.Router();

const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                if (file.fieldname === 'image') {
                        cb(null, 'images')
                }
                else if (file.fieldname === 'file') {
                        cb(null, 'uploads')
                }
        },
        filename: (req, file, cb) => {
                cb(null, file.originalname)
        }
})

const upload = multer({ storage: storage });
const storages = multer.memoryStorage(); // You can configure storage as needed
const uploads = multer({ storage });
// 
router.post('/login', con.login);
router.post('/signup/teacher', upload.single('image'), teacher.signup);
router.post('/signup/student', upload.single('image'), student.signup);

//student 
router.get('/admin/student/all', studentList.displayAll);
router.get('/admin/student/:id', studentList.getbyId, doc.display);
router.post('/admin/student/all/name', studentList.getbyName);
router.post('/admin/admin/student/all/generation', studentList.getbyGeneration);
router.post('/admin/student/delete/:id', studentList.remove);
router.post('/admin/student/update/:id', studentList.update);


//teacher-
router.get('/admin/teacher/all', teachers.DisplayAll);
router.post('/admin/teacher/update', teachers.update);
router.post('/admin/teacher/delete/:id', teachers.remove);
router.get('/admin/teacher/:id', teachers.getById);
router.post('/admin/teacher/all/name', teachers.getByName);

//file
// router.use(upload_file());
router.get('/like', (req, res) => {
        res.sendFile(__dirname + '/index.html');
});
//thesis
router.post('/admin/thesis/create', upload.single('file'), thesis.create);
router.get('/admin/thesis/all', thesis.displayThesis);
router.get('/admin/thesis/all/:id', thesis.displayById);
router.post('/admin/thesis/all/field', thesis.SearchbyField);
router.post('/admin/thesis/all/generation')
router.post('/admin/thesis/delete/:id', thesis.remove);

//course
router.get('/course/all', course.displayAll);
router.get('/course/:id', course.getbyId);
router.post('/course/create', upload.single('image'), course.create);
router.post('/course/remove/:id', course.remove);
router.post('/course/update', course.update);
router.post('/search/course', course.getbyCourse);

//role
router.get('/role/all', role.displayAll);
// router.get('/role/:id', role.getbyId);
router.post('/role/create', role.create);
router.post('/role/remove/:id', role.remove);
router.post('/role/update/:id', role.update);

//project
// router.post('/project/create', upload.single('pdf'), project.create);
router.get('/admin/project/all', project.displayAll);
router.post('/admin/project/create', upload.single('file'), project.create);
// router.post('/admin/project/create', upload.fields([
//         { name: 'image' },
//         { name: 'file' }
// ]), project.create);
router.post('/admin/team_project/update', project.update);
router.post('/admin/team_project/delete/:id', project.remove);
router.get('/admin/team_project/:id', project.displayById);
router.post('/admin/project/all/bycourse', project.getbyCourse);

router.post('/admin/project/addMember/:id', member.addMember);

//comment
router.post('/comment/create', comment.create);
router.post('/comment/update/:id', comment.update);
router.post('/comment/delete/:id', comment.remove);
router.get('/comment/:id', comment.getbyId);
router.get('/comment/all', comment.displayAll);

//rating
router.post('/like', rating.create);

// addmin dashboard
router.get('/getCourseCount', dashboard.getCountCourse);
router.get('/getTeacherCount', dashboard.getCountTeacher);
router.get('/getstudentCount', dashboard.getCountStudent);
router.get('/getFemaleCount', dashboard.getFemale);
router.get('/getMaleCount', dashboard.getMale);

// photo
router.post('/upload/photo', upload.single('image'), photo.create);

// student 
router.get('/student/thesis/:email', thesis.display);

module.exports = router;

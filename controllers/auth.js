const db = require('../config/db')
const bcrypt = require('bcrypt');
const UserModel = require('../studentControllers/auth');
const jwt = require("jsonwebtoken");

exports.logout = async function logout(req, res) {
        var now = new Date();
        console.log(now);
        res
                .status(200)
                .cookie("access_token", "", {
                        expire: now,
                        httpOnly: true,
                        // secure: process.env.NODE_ENV === "production",
                })
                .json({
                        message: "Admin login successfully!",
                });
};

exports.login = async function login(req, res) {
        const admin = {
                email: "admin@123",
                password: "admin",
        };
        if (!req.body.email) {
                res.status(404).send("You need to input your email");
        } else if (!req.body.password) {
                res.status(404).send("You need to input your password");
        }
        if (req.body.email === admin.email && req.body.password === admin.password) {
                const token = jwt.sign(admin, 't0kenEncrypti0n');
                res
                        .status(200)
                        .cookie("access_token", token, {
                                maxAge: 90000000,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                        })
                        .json({
                                message: "Admin login successfully!",
                        });
        } else if (
                req.body.email === admin.email &&
                req.body.password !== admin.password
        ) {
                res.status(401).json({ message: "Incorrect Password" });
        } else if (
                req.body.email !== admin.email &&
                req.body.password === admin.password
        ) {
                res.status(401).json({ message: "Incorrect Email" });
        } else {
                var email = req.body.email;
                var role = req.body.role;
                var password = req.body.password;
                const isValidPassword = await bcrypt.hash(password, 10);
                db.query('SELECT * FROM users u JOIN roles r WHERE u.role_id = r.role_id AND r.role_name = ?  ', [role], (error, results) => {
                        if (error) {
                                res.json({
                                        status: false,
                                        message: 'there are some error with query'
                                })
                        } else {
                                if (role === "student") {
                                        db.query('SELECT s.*, r.role_name, filepath FROM users u JOIN students s ON s.student_id = u.student_id JOIN roles r ON s.role_id= r.role_id JOIN photo p ON p.student_id = s.student_id  WHERE  s.email = ? ', email, (error, results) => {
                                                if (error) {
                                                        res.json({
                                                                status: false,
                                                                message: 'there are some error with query'
                                                        })
                                                } else {
                                                        if (results.length > 0) {
                                                                if (isValidPassword) {
                                                                        const id = results[0].student_id;
                                                                        const first_name = results[0].first_name;
                                                                        const last_name = results[0].last_name;
                                                                        const name = results[0].username;
                                                                        const gender = results[0].gender;
                                                                        const email = results[0].email;
                                                                        const generation = results[0].generation;
                                                                        const role_name = results[0].role_name;
                                                                        const filepath = results[0].filepath;
                                                                        const token = jwt.sign({ id, first_name, last_name, email, name, gender, generation, role_name, filepath }, 't0kenEncrypti0n', { expiresIn: '1d' });
                                                                        // res.cookie('access_token', token);
                                                                        res.setHeader('Authorization', `Bearer ${token}`);
                                                                        console.log(id);
                                                                        return res.json({
                                                                                status: true,
                                                                                data: results,
                                                                                token,
                                                                                message: 'Successfully authenticated'
                                                                        });

                                                                }
                                                        }
                                                }
                                        })
                                }

                                else if (role === "teacher") {
                                        db.query('SELECT t.*,t.username, r.role_name, p.filepath FROM users u JOIN  teachers t ON t.teacher_id = u.teacher_id JOIN roles r ON t.role_id= r.role_id JOIN photo p ON p.teacher_id= t.teacher_id  WHERE  t.email =?', email, (error, results) => {
                                                if (error) {
                                                        res.json({
                                                                status: false,
                                                                message: 'there are some error with query'
                                                        })
                                                } else {
                                                        if (results.length > 0) {
                                                                if (isValidPassword) {
                                                                        const { first_name, last_name, gender, email, role_name } = results[0];
                                                                        const teacher_id = results[0].teacher_id;
                                                                        const name = results[0].username;
                                                                        const filepath = results[0].filepath;
                                                                        const token = jwt.sign({ teacher_id, name, first_name, last_name, email, gender, role_name, filepath }, 't0kenEncrypti0n');
                                                                        console.log('access_token:', token);
                                                                        res.setHeader('Authorization', `Bearer ${token}`);
                                                                        console.log("teacher id: ", teacher_id);
                                                                        console.log("name:", name)
                                                                        return res.json({
                                                                                status: true,
                                                                                data: results,
                                                                                token,
                                                                                message: 'Successfully authenticated'
                                                                        });
                                                                }
                                                        }
                                                }
                                        })
                                }
                                else {
                                        console.log('error');
                                        // alert(res.data.error);
                                }
                        }
                })

        }


        exports.authenticate = async function authenticate(req, res, next) {
                const token = req.cookies.access_token;
                if (!token) {
                        return res
                                .sendStatus(401)
                                .json({ message: "you  cannot get user information." });
                } else {
                        next();
                }
        };

        exports.isAdmin = async function isAdmin(req, res, next) {
                const admin = {
                        email: "admin@123",
                        password: "admin",
                };
                const token = req.cookies.access_token;
                const verified = jwt.verify(token, config.authentication.jwtSecret);
                if (verified.email === admin.email && verified.password === admin.password) {
                        next();
                } else {
                        return res.sendStatus(401).json({ message: "Can't Access!!!" });
                }
        };

}
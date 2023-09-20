const db = require('../config/db')
const bcrypt = require("bcrypt");

// const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");

const JWT_SECRET = 'secret';

exports.logout = async function logout(req, res) {
        var now = new Date();
        console.log(now);
        res
                .status(200)
                .cookie("access_token", "", {
                        expire: now,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                })
                .json({
                        message: "Admin login successfully!",
                });
};

exports.login = async function login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const admin = {
                email: "admin@123",
                password: "admin",
        };
        if (!req.body.email) {
                res.status(404).error("You need to input your email");
        } else if (!req.body.password) {
                res.status(404).error("You need to input your password");
        }
        if (req.body.email === admin.email && req.body.password === admin.password) {
                const token = jwt.sign(admin, JWT_SECRET);
                res.status(200)
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
        }
        else {
                const role = req.body;
                try {
                        const [user] =await db.promise().query('SELECT * FROM account WHERE email = ? ', [email]);
                
                        if (user.length === 0) {
                            return res.status(404).json({ message: 'user not found' });
                        }
                
                        const isPasswordValid = await bcrypt.compare(password, user[0].password);
                
                        if (!isPasswordValid) {
                            return res.status(401).json({ message: 'Incorrect password' });
                        }
                        const studentData = {
                            id: user[0].id,
                            email: user[0].email,
                            password: user[0].password
                        };
                        console.log(studentData);
                        if (req.body.role == "student"){
                                const token = jwt.sign(studentData, JWT_SECRET);
                                return res.json({ message: 'Student login successful', token });
                        }
                        else {
                                const token = jwt.sign(studentData, JWT_SECRET);
                                return res.json({ message: 'teacher login successful', token });
                        }
                        
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: 'An error occurred' });
                    }


        }
};

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
        const verified = jwt.verify(token, JWT_SECRET);
        if (verified.email === admin.email && verified.password === admin.password) {
                next();
        } else {
                return res.sendStatus(401).json({ message: "Can't Access!!!" });
        }
};
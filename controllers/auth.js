const db = require('../config/db')
const bcrypt = require('bcrypt');
const config = require('../middleware/config');
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
                res.status(404).send("You need to input your email");
        } else if (!req.body.password) {
                res.status(404).send("You need to input your password");
        }
        if (req.body.email === admin.email && req.body.password === admin.password) {
                const token = jwt.sign(admin, config.authentication.jwtSecret);
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
                const { email, password } = req.body;

                try {
                        const user = await UserModel.getUserByEmail(email);

                        if (!user) {
                                return res.status(401).json({ error: 'Invalid credentials' });
                        }

                        // Compare the entered password with the hashed password
                        // const isValidPassword = bcrypt.hash(password, user.password);
                        const isValidPassword = await bcrypt.hash(password, 10);

                        if (!isValidPassword) {
                                return res.status(401).json({ error: 'Invalid credentials' });
                        }

                        const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
                        res.setHeader('Authorization', `Bearer ${token}`);
                        console.log(user.email);
                        return res.status(200).json({ message: 'Login successful', token });

                } catch (error) {
                        console.error('Error during login:', error);
                        return res.status(500).json({ error: 'Internal server error' });
                }
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
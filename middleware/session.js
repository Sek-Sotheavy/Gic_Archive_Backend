
// const ensureLogIn = (req, res, next) => {
//         if (!req.session.jwtToken) {
//                 return res.json({
//                         success: false,
//                         error: `You must Log In~`
//                 })
//         }
//         next();
// }

// const ensureLogOut = (req, res, next) => {
//         if (req.session.jwtToken) {
//                 return res.json({
//                         success: false,
//                         error: `You already log in~`
//                 })
//         }
//         next();
// }

// module.exports = {
//         ensureLogIn,
//         ensureLogOut
// }
// sessionMiddleware.js
const session = require('express-session');

const sessionOptions = {
        secret: 'Mysecret',
        resave: false,
        saveUninitialized: true,
};

const sessionMiddleware = session(sessionOptions);

module.exports = sessionMiddleware;

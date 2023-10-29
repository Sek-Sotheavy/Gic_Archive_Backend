const jwt = require('jsonwebtoken');
const secretKey = 't0kenEncrypti0n';

const checkUserLoggedIn = (req, res, next) => {
        try {

                const token = req.headers['authorization'];

                const tokens = req.Cookies.access_token;
                console.log("cookie:", token);
                console.log('Token from cookie:', tokens);
                // const token = req.cookies;
                if (!token) {
                        return res.json({ Message: "We need token please provide it." })
                }
                else {
                        jwt.verify(token, secretKey, (err, decoded) => {
                                if (err) {
                                        return res.json({ message: "Authentication Error." })
                                }
                                else {
                                        req.user = decoded;
                                        req.id = decoded.id
                                        req.email = decoded.email
                                        req.name = decoded.name
                                        req.gender = decoded.gender
                                        req.first_name = decoded.first_name
                                        req.last_name = decoded.last_name
                                        req.generation = decoded.generation
                                        req.role_name = decoded.role_name
                                        req.filepath = decoded.filepath
                                        console.log(req.id);
                                        console.log(req.filepath);
                                        
                                        next();
                                }
                        })
                        next();
                }
        }
        catch (error) {
                return res.status(401).json({
                        message: "Auth failed"
                });
        }
};
const ensureSignedIn = (req, res, next) => {

        if (!req.session.jwt) {
                return res.json({
                        success: false,
                        error: `You must sign In~`
                })
        }

        next();
}

const ensureSignedOut = (req, res, next) => {
        if (req.session.jwt) {
                return res.json({
                        success: false,
                        error: `You already signed in~`
                })
        }
        next();
}
module.exports = {
        checkUserLoggedIn,
        ensureSignedIn,
        ensureSignedOut
};

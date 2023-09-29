const jwt = require('jsonwebtoken');

const secret = 'secret';

const TokenService = {
        generateToken: (payload) => {
                return jwt.sign(payload, secret, { expiresIn: '1h' });
        },
        verifyToken: (token) => {
                return jwt.verify(token, secret);
        },
};

module.exports = TokenService;
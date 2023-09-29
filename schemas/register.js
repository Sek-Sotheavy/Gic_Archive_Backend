const Joi = require('joi');

const registerSchema = Joi.object({
        email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
        username: Joi.string()
                .alphanum()
                .min(3)
                .max(20)
                .required(),
        firstname: Joi.string()
                .alphanum()
                .min(3)
                .max(10)
                .required(),
        lastname: Joi.string()
                .alphanum()
                .min(3)
                .max(10)
                .required(),
        password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .min(4)
                .max(20)
                .required()

});
module.exports = registerSchema;
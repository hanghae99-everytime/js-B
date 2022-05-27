const cryptoJS = require('crypto-js');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../DBindex');

exports.signup = async (req, res) => {
    try {
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(/^?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^*_-]{8,16}$/)
                .required(),
        });
        const { email, password } = await userSchema.validateAsync(req.body);
        const checkUser = db.query(
            'select * from users where users.email=req.body.email'
        );
        if (checkUser) {
            return res.status(400).json({
                result: false,
                fail: '이미 존재하는 이메일입니다.',
            });
        }
    } catch (e) {
        const joiError = e.details[0].message;
        if (joiError.includes('email')) {
            res.status(400).json({
                result: false,
                msg: '이메일 형식이 올바르지 않습니다.',
            });
        }
        if (joiError.includes('password')) {
            res.status(400).json({
                result: false,
                msg: '비밀번호가 올바르지 않습니다.',
            });
        }
    }
};

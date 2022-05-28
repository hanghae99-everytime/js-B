require('dotenv').config();
const cryptoJS = require('crypto-js');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../DBindex');

const sql_query = (query, value) => {
    db.query(query, value, (err, result, fields) => {
        if (err) return console.log(err);
        console.log('query', query);
        console.log('value', value);
        console.log('result', result);
        return result;
    });
};

// db.query('SELECT * FROM users', (error, result) => {
//     if (error) return console.log(error, 'check');

//     console.log(result);
// });

exports.signup = async (req, res) => {
    try {
        // Joi
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            pwd: Joi.string()
                .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^*_-]{8,16}$/)
                .required(),
            path: Joi.string().required(),
        });

        // 형식확인
        const { email, pwd, path } = await userSchema.validateAsync(req.body);
        if (sql_query('select * from users where email=?', email)) {
            return res.status(400).json({
                result: false,
                fail: '이미 존재하는 이메일입니다.',
            });
        }
        const privateKey = process.env.SIGNUP_SECRET_KEY;
        const encryted = cryptoJS.AES.encrypt(
            JSON.stringify(pwd),
            privateKey
        ).toString();

        await db.query('insert into users (email, pwd, path) values(?, ?, ?)', [
            email,
            encryted,
            path,
        ]);

        res.status(201).json({
            result: true,
            msg: '회원가입에 성공하였습니다.',
        });
    } catch (e) {
        console.log('catch error', e);
        const joiError = e.details[0].message;
        if (joiError.includes('email')) {
            res.status(400).json({
                result: false,
                msg: '이메일 형식이 올바르지 않습니다.',
            });
        }
        if (joiError.includes('pwd')) {
            res.status(400).json({
                result: false,
                msg: '비밀번호가 올바르지 않습니다.',
            });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const { email, pwd } = req.body;
        const privateKey = process.env.SIGNUP_SECRET_KEY;
        const checkUser = await db.query(
            'select * from users where email=?',
            email
        );

        if (!checkUser) {
            return res.status(400).json({
                result: false,
            });
        }

        const token = jwt.sign(
            {
                userID: checkUser.id,
            },
            process.env.TOKEN_SECRET_KEY
        );

        res.status(200).json({
            result: true,
            msg: '로그인 성공~!!',
            user: { token },
        });
    } catch (e) {
        console.log(e);
        next;
    }
};

exports.auth = (req, res) => {
    const { user } = res.locals;

    if (user) {
        res.json({ result: true, user: { userID: user.id } });
    } else {
        res.send({
            result: false,
            msg: '접근경로가 올바르지 않습니다.',
        });
    }
};

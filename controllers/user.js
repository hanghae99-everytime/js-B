require('dotenv').config();
const cryptoJS = require('crypto-js');
// const nodemailer = require('node-mailer')
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../DBindex');

exports.signup = async (req, res) => {
    // console.log('req.file.location', req.file.location);
    try {
        // Joi
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            pwd: Joi.string()
                .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^*_-]{8,16}$/)
                .required(),
        });

        // 형식확인
        const { email, pwd } = await userSchema.validateAsync(req.body);
        await db.query(
            'select * from users where email=?',
            email,
            (error, result, field) => {
                if (error) return console.log('query error', error);
                if (result.length !== 0) {
                    return res.status(400).json({
                        result: false,
                        fail: '이미 존재하는 이메일입니다.',
                    });
                } else {
                    const privateKey = process.env.SIGNUP_SECRET_KEY;
                    const encryted = cryptoJS.AES.encrypt(
                        JSON.stringify(pwd),
                        privateKey
                    ).toString();

                    // const EMAIL = process.env.EMAIL;
                    // const EMAIL_PASSWORD = process.env.PASSWORD;

                    // let receiverEmail = EMAIL;
                    // let mailOptions = ``;

                    // let transport = nodemailer.createTransport({
                    //     service: 'gmail',
                    //     auth: {
                    //         user: EMAIL,
                    //         pass: EMAIL_PASSWORD,
                    //     },
                    // });

                    // mailOptions = {
                    //     from: EMAIL,
                    //     to: receiverEmail,
                    //     subject: 'everytime 인증 요청입니다.',
                    //     text: `email은 ${result[0].email}`
                    // };

                    // transport.sendMail(mailOptions, (error, info) => {
                    //     if (error) {
                    //         console.log(error);
                    //         return;
                    //     }
                    // });

                    db.query(
                        // 'insert into users (email, pwd, path) values(?, ?, ?)',
                        'insert into users (email, pwd) values( ?, ?)',
                        [email, encryted]
                        // [email, encryted, req.file.location]
                    );

                    res.status(201).json({
                        result: true,
                        msg: '회원가입에 성공하였습니다.',
                    });
                }
            }
        );
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

exports.login = async (req, res, next) => {
    try {
        const { email, pwd } = req.body;
        const privateKey = process.env.SIGNUP_SECRET_KEY;
        await db.query(
            'select * from users where email=?',
            email,
            (error, result, field) => {
                if (error) return console.log('query error', error);
                if (result.length === 0) {
                    return res.status(400).json({
                        result: false,
                        msg: '이메일이 틀립니다.',
                    });
                }

                const bytes = cryptoJS.AES.decrypt(result[0].pwd, privateKey);
                const decrypted = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
                if (pwd !== decrypted) {
                    return res.status(400).json({
                        fail: '비밀번호를 다시 확인해주세요.',
                    });
                }
                console.log('result[0].id', result[0].id);
                const token = jwt.sign(
                    {
                        userID: result[0].id,
                    },
                    `${process.env.TOKEN_SECRET_KEY}`
                );

                res.status(200).json({
                    result: true,
                    msg: '로그인 성공~!!',
                    user: { token },
                });
            }
        );
    } catch (e) {
        console.log('catch error', e);
        res.status(401).json({
            result: false,
            msg: '예상치 못한 오류가 발생하였습니다.',
        });
    }
};

exports.auth = (req, res) => {
    const { user } = res.locals;

    if (user) {
        res.json({ result: true, user: { userID: user.id } });
    }
    res.json({
        result: false,
        msg: '접근경로가 올바르지 않습니다.',
    });
};

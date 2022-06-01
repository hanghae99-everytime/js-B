const jwt = require('jsonwebtoken');
const db = require('../DBindex');
require('dotenv').config();

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization === undefined) {
        res.status(400).json({ errorMessage: '로그인 후 사용하시오' });
    }

    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType != 'Bearer') {
        res.status(401).json({
            errorMessage: '로그인 후 사용하시오',
        });
    }

    try {
        const id = await jwt.verify(
            tokenValue,
            `${process.env.TOKEN_SECRET_KEY}`
        );

        await db.query(
            'select * from users where id=?',
            id.userID,
            (error, result, field) => {
                if (error) return console.log('query error', error);
                res.locals.user = result[0];
                next();
            }
        );
    } catch (error) {
        //jwt 토큰이 유효하지 않은 경우
        res.status(401).json({
            result: false,
            mag: '로그인 후 사용하시오',
        });
    }
};

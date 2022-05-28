require('dotenv').config();
const db = require('../DBindex');

exports.post = async (req, res) => {
    const { articleID } = req.params;
    const { content } = req.body;
    const { user } = res.locals;
    try {
        await db.query(
            'insert into comments(content, userID, articleID) values(?, ?, ?)',
            [content, user.id, articleID]
        );
        res.status(201).json({
            result: true,
            msg: '작성이 완료되었습니다.',
        });
    } catch (e) {
        res.status(400).json({
            result: false,
            msg: '작성시 예기치 못한 오류가 발생하였습니다.',
        });
    }
};

exports.delete = async (req, res) => {
    const { commentID } = req.params;
    try {
        await db.query('delete from comments where id=?', commentID);
        res.status(200).json({
            result: true,
            msg: '삭제가 완료되었습니다.',
        });
    } catch (e) {
        res.status(400).json({
            result: false,
            msg: '삭제시 예기치 못한 오류가 발생하였습니다.',
        });
    }
};

exports.patch = async (req, res) => {
    const { commentID } = req.params;
    const { content } = req.body;
    try {
        await db.query('update comments set content=? where id=?', [
            content,
            commentID,
        ]);
        res.status(200).json({
            result: true,
            msg: '수정이 완료되었습니다.',
        });
    } catch (e) {
        res.status(400).json({
            result: false,
            msg: '수정시 예기치 못한 오류가 발생하였습니다.',
        });
    }
};

exports.postLike = async (req, res) => {
    const { commentID } = req.params;
    const { user } = res.locals;
    try {
        await db.query('insert into likes(userID, commentID) values(?, ?)', [
            user.id,
            commentID,
        ]);
        res.status(200).json({
            result: true,
            msg: '좋아요!',
        });
    } catch (e) {
        res.status(400).json({
            result: false,
            msg: '오류발생',
        });
    }
};

exports.deleteLike = async (req, res) => {
    const { commentID } = req.params;
    try {
        await db.query('delete from likes where commentID=?', commentID);
        res.status(200).json({
            result: true,
            msg: '좋아요 취소!',
        });
    } catch (e) {
        res.status(400).json({
            result: false,
            msg: '오류발생',
        });
    }
};

require('dotenv').config();
const db = require('../DBindex');

exports.totalCount = async (req, res) => {
    const cnt = await db.query('select count(*) from articles');
    res.status(200).json({
        result: true,
        articleCount: cnt,
    });
};

// 무한스크롤 -> 수정 필요 / articleInfo에 모든 데이터가 들어갈까? 배열에 넣어서 줘야 함
exports.showTotal = async (req, res) => {
    const { page } = req.query;
    try {
        let articles = await db.query(
            'select A.title, A.content, B.image, C.count(*), D.count(*) from articles A left join images B on A.id=B.articleID left join likes C on A.id=C.articleID left join comments D on A.id=articleID where A.id order by A.id desc limit 10',
            page
        );
        res.status(200).json({
            result: true,
            articles: [articles],
        });
    } catch (e) {
        console.log(e);
        next;
    }
};

exports.search = async (req, res) => {
    const { page, q } = req.query;
    const keyword = req.query.q.replace(/\s/gi, '');
    try {
        const articles = db.query(
            'select A.title, A.content, B.image, C.count(*), D.count(*) from articles A left join images B on A.id=B.articleID left join likes C on A.id=C.articleID left join comments D on A.id=articleID where A.id ...? (A.title like "%?%" or A.content like "%?%") order by A.id desc limit 10',
            [page, keyword]
        );

        res.status(200).json({
            result: true,
            articles: [articles],
        });
    } catch (e) {
        console.log(e);
        next;
    }
};

// 게시글 작성, images 테이블에 articleID 추가 보완 필요
exports.post = (req, res) => {
    const { user } = res.locals;
    const { title, content } = req.body;
    try {
        if (req.file.location) {
            db.query(
                'insert into articles(title, content, userID, isImage) values(?, ?, ?, ?)',
                [title, content, user.id, true]
            );
            db.query('insert into images(image, articleID) values(?, ?)', [
                req.file.location,
            ]);
        } else {
            db.query(
                'insert into articles(title, content, userID) values(?, ?, ?)',
                [title, content, user.id]
            );
        }
        res.status(200).json({
            result: true,
            msg: '작성이 완료되었습니다.',
        });
    } catch (e) {
        console.log(e);
        next;
    }
};

// 게시글 상세 -> 보완 필요
exports.showOne = (req, res) => {
    const { articleID } = req.params;
    const article = db.query(
        'select A.id, A.title, A.content, A.userID, B.iamge, '
    );
};

exports.delete = (req, res) => {
    const { articleID } = req.params;
    try {
        db.query('delete from articles where id=?', articleID);
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

// 게시글 수정 -> 보완 필요
// exports.modify = (req, res) => {
//     const { articleID } = req.params;
//     try {
//         db.query('update articles set ')
//     }
// }

exports.postLike = (req, res) => {
    const { articleID } = req.params;
    const { user } = res.locals;
    try {
        db.query('update likes set userID=? where articleID=?', [
            user.id,
            articleID,
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

exports.deleteLike = (req, res) => {
    const { articleID } = req.params;
    try {
        db.query('update likes set userID=null where articleID=?', articleID);
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

exports.myLike = (req, res) => {
    const { user } = res.locals;
    try {
        const likes = db.query(
            'select A.count(*),B.title, B.content, B.isImage, C.count(*) from likes A left join articles B on A.userID=B.userID left join comments C on A.userID=C.userID where userID=?',
            user.id
        );
        // const likeCnt = db.query('select count(*) from likes where userID=?', user.id)
        // const commentCnt = db.query('select count(*) from comments where userID=?', user.id)
        res.status(200).json({
            result: true,
            likes: [likes],
        });
    } catch (e) {
        console.log(e);
        next;
    }
};

exports.myArticle = (req, res) => {
    const { user } = res.locals;
    try {
        const articles = db.query(
            'select A.title, A.content, A.isImage, B.count(*),C.count(*) from articles A left join likes B on A.userID=B.userID left join comments C on A.userID=C.userID where userID=?',
            user.id
        );
        res.status(200).json({
            result: true,
            articles: [articles],
        });
    } catch (e) {
        console.log(e);
        next;
    }
};

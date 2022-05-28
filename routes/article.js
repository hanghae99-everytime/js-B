const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const articleController = require('../controller/article');
const upload = require('../multer'); // post 할 때 이미지 여러 개 올리는 방법 보완 필요

router.get('/articles/articleCount', articleController.totalCount);
router.get('/articles', articleController.showTotal);
router.get('articles/search', articleController.search);
router.post('/articles', authMiddleWare, articleController.post);
router.get('/articles/:articleID', articleController.showOne);
router.delete('/articles/:articleID', authMiddleWare, articleController.delete);
router.patch('/articles/:articleID', authMiddleWare, articleController.modify);
router.post(
    '/articles/:articleID/like',
    authMiddleWare,
    articleController.postLike
);
router.delete(
    '/articles/:articleID/like',
    authMiddleWare,
    articleController.deleteLike
);
router.get('/articles/myLike', authMiddleWare, articleController.myLike);
router.get('/articles/myArticle', articleController.myArticle);

module.exports = router;

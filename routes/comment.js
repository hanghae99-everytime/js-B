const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const commentController = require('../controller/comment');

router.post(
    '/articles/:articleID/comments',
    authMiddleWare,
    commentController.post
);
router.delete(
    '/articles/comments/:commentID',
    authMiddleWare,
    commentController.delete
);
router.patch(
    '/articles/comments/:commentID',
    authMiddleWare,
    commentController.patch
);
router.post(
    '/articles/comments/:commentID/like',
    authMiddleWare,
    commentController.postLike
);
router.delete(
    '/articles/comments/:commentID/like',
    authMiddleWare,
    commentController.deleteLike
);

const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controllers/user');
// const upload = require('../multer');

// router.post('/user/signup', upload.single('auth'), userController.signup);
router.post('/user/signup', userController.signup);
router.post('/user/login', userController.login);
router.get('/user/auth', authMiddleWare, userController.auth);

module.exports = router;

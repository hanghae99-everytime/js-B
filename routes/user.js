const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');
const upload = require('../multer');

router.post('/user/signup', upload.single('auth'), userController.signUp);
router.post('/user/login', userController.login);
router.get('/user/auth', authMiddleWare, userController.auth);

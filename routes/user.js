const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');

router.post('/user/signup', userController.signUp);
router.post('/user/login', userController.login);
router.get('/user/auth', authMiddleWare, userController.auth);

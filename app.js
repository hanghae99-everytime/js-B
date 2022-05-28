require('dotenv').config();
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const articleRouter = require('./routes/article');
const commentRouter = require('./routes/comment');
const userRouter = require('./routes/user');
const port = process.env.PORT;
const db = require('./DBindex');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();

app.use(cors());

app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 100,
    })
);

app.use('/api', [articleRouter, commentRouter, userRouter]);

app.listen(port, () => {
    console.log('complete connect to server');
});

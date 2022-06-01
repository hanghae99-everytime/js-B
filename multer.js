const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
});

console.log('@@@@@@@@@@@@@@@@@', s3);

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            console.log('file in multer', file);
            if (!file) next();
            else {
                let arr = file.originalname.split('.');
                console.log('arr', arr);
                let ext = arr[arr.length - 1].trim().toLowerCase();
                console.log('ext', ext);
                if (
                    ext !== 'png' &&
                    ext !== 'gif' &&
                    ext !== 'jpg' &&
                    ext !== 'jpeg'
                )
                    return;
                cb(
                    null,
                    Math.floor(Math.random() * 1000).toString() +
                        Date.now() +
                        '.' +
                        file.originalname.split('.').pop()
                );
            }
        },
    }),
    limits: {
        fileSize: 1000 * 1000 * 10,
    },
});

module.exports = upload;

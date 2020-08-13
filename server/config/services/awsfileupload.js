const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const uploadfiles = multer({
    storage: multerS3({
        s3,
        bucket: 'sendex-contenido',
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, { fieldName: 'TESTING_META_DATA!' });
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})


module.exports = uploadfiles;
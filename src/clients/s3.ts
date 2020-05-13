import AWS from 'aws-sdk'
AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
AWS.config.region = 'ap-southeast-1';
export const clientS3 = new AWS.S3();

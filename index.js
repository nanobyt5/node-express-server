const querystring = require("querystring");
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.ACCESS_KEY,
    region: 'ap-southeast-1'
});
const s3 = new AWS.S3();

const upload = async (data) => {
    console.log("Uploading task to bucket");

    const params = {
        ACL: "public-read",
        Body: JSON.stringify(data),
        ContentType: "application/json",
        Bucket: "local-testing-nazryl",
        Key: "Storage/heroes.json"
    };

    return await new Promise((resolve, reject) => {
        s3.putObject(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

function readS3() {
    const params = {
        Bucket: "local-testing-nazryl",
        Key: "Storage/heroes.json"
    };
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) reject(err);
            else resolve(data.Body.toString('utf-8'));
        });
    });
}

exports.handler = async (event, context, callback) => {
    const res = {
        statusCode: null,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        },
        body: ""
    };

    const params = querystring.parse(event.body);

    res.statusCode = 200;

    if (params.command === "/heroes") {
        res.body = params.text;
        upload(JSON.parse(querystring.parse(event.body)));
    } else {
        res.body = await readS3();
    }

    callback(null, res);
};

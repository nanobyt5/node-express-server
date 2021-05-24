const querystring = require("querystring");

exports.handler = (event, context, callback) => {
    const res = {
        statusCode: null,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        },
        body: ""
    }

    const params = querystring.parse(event.body);

    res.statusCode = 200;

    if (params.command == "/heroes") {
        res.body = params.text;
    }
    callback(null, res);
}
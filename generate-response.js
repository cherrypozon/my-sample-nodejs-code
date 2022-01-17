module.exports = (statusCode, responseBody) => {
    let newResponseBody;
    if (statusCode !== 200) {
        newResponseBody = {
            "message": responseBody["message"],
            "stack": responseBody["stack"],
        };
    } else newResponseBody = responseBody;
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, vip-user-authorized, Origin",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Allow-Credentials": true,
        },
        "body": JSON.stringify(newResponseBody),
    };
};

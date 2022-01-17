exports.handler = async (event) => {
    return {
        "statusCode": 200,
        "body": JSON.stringify("Welcome to '" + process.env.PIPELINE_NAME + "' pipeline!"),
    };
};

const AWS = require('aws-sdk');

// to update items dynamoDB 
const updateDynamo = async (req_eid, req_key, updateExp, attriVal, attriNames) => {
    const dynamoDBTable = process.env.NOTIF_USER_DB;
    const region = process.env.REGION;
    AWS.config.update({ region: region });
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: dynamoDBTable,
        Key:{
            "id": req_eid,
            "key": req_key
        },
        UpdateExpression: `set ${updateExp}`,
        ConditionExpression: "(id = :eid)",
        ExpressionAttributeValues:attriVal,
        ExpressionAttributeNames: attriNames,
        ReturnValues:"ALL_NEW"
    };

    let res;
    try {
        res = await ddb.update(params).promise();
    } catch (error) {
        console.log(error + ' because request payload has invalid user eid');
        res = {};
    }
    return res;
}

// to put items in dynamodb
const putDynamo = async (toPut) => {
    const dynamoDBTable = process.env.NOTIF_USER_DB;
    const region = process.env.REGION;
    AWS.config.update({ region: region });
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: dynamoDBTable,
        Item: toPut
    }

    let res;
    try {
        res = await ddb.put(params).promise();
    } catch (error) {
        console.log(error);
        res = {};
    }
    return res
}

module.exports = { updateDynamo, putDynamo };
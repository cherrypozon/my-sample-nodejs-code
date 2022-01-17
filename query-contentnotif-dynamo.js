const AWS = require('aws-sdk');

// Query for financials update company data @ notifcontent-db
const defaultQuery = async (req_key, items) => {
    const dynamoDBTable = process.env.NOTIF_CONTENT_DB;
    const region = process.env.REGION;

    AWS.config.update({ region: region });

    const ddb = new AWS.DynamoDB.DocumentClient();
    let params = {};

    switch (req_key) {
        case 'FinancialsUpdate':
            items.attributes = JSON.parse(items.attributes);
            const companyId = items.attributes.companyId;
            const Key = items.financialsnotifId;

            params = {
                TableName: dynamoDBTable,
                ProjectionExpression: '#i, #k, #a, #f',
                KeyConditionExpression: '#i = :id_value and begins_with(#k, :key_value)',
                ExpressionAttributeNames: {
                    '#i': 'id',
                    '#k': 'key',
                    '#a': 'attributes',
                    '#f': 'financialnotifid'
                },
                ExpressionAttributeValues: {
                    ':id_value': companyId,
                    ':key_value': req_key + '-' + Key
                },
                ScanIndexForward: false
            };
            break;
        case 'WhatsNew':
            params = {
                TableName: dynamoDBTable,
                ProjectionExpression: '#i, #k, #a, #d, #exp',
                KeyConditionExpression: '#t = :type_value',
                ExpressionAttributeNames: {
                    '#i': 'id',
                    '#k': 'key',
                    '#d': 'date',
                    '#a': 'attributes',
                    '#t': 'type',
                    '#exp': 'expdate'
                },
                ExpressionAttributeValues: {
                    ':type_value': 'WhatsNew'
                },
                IndexName: 'type-index',
                ScanIndexForward: false
            };
            break;
    }

    let res;
    try {
        res = await ddb.query(params).promise();
    } catch (error) {
        console.log('error at query contentnotif: ' + error);
    }

    return res;
};

//Params for querying Whats New content @ notifcontent-db
const contentWhatsNewQuery = async () => {
    const notifContentDB = process.env.NOTIF_CONTENT_DB;
    const region = process.env.REGION;

    AWS.config.update({ region: region });

    const ddb = new AWS.DynamoDB.DocumentClient();

    const whatsNewParams = {
        TableName: notifContentDB,
        ProjectionExpression: '#i, #k, #a, #d',
        KeyConditionExpression: '#t = :type_value',
        ExpressionAttributeNames: {
            '#i': 'id',
            '#k': 'key',
            '#d': 'date',
            '#a': 'attributes',
            '#t': 'type'
        },
        ExpressionAttributeValues: {
            ':type_value': 'WhatsNew'
        },
        IndexName: 'type-index',
        ScanIndexForward: false
    };

    let res;
    try {
        res = (await ddb.query(whatsNewParams).promise()).Count;
    } catch (error) {
        console.log('error at query Whats New notifcontent: ' + error);
    }
    return res;
};

module.exports = { defaultQuery, contentWhatsNewQuery };

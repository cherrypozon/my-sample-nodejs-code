const generateResponse = require('../utils/helpers/generate-response');
const writeUserNotif = require('../utils/helpers/write-usernotif-dynamo');
const transform = require('../transform');

exports.handler = async (ctx) => {
    try {
        const reqBody = JSON.parse(ctx['body']);
        let respBody = Object;

        if (reqBody['id']) {
            const initBody = {};
            let toUpdate;
            let toPut;
            let notifId;
            let req_key;

            // for response body
            initBody['statusCode'] = 200;

            // transform key and get id
            const req_eid = reqBody['id'];

            switch (reqBody['key']) {
                case 'FinancialsUpdate':
                    notifId = `${reqBody['fiscalYear']}${reqBody['fiscalQuarter']}`;
                    req_key = `${reqBody['key']}-${reqBody['companyId']}-${notifId}`;
                    initBody['message'] = `${reqBody['companyName']} ${notifId} is set to isRead:${reqBody['isRead']}`;

                    toUpdate = transform.isReadAttributesFinUp(reqBody);
                    break;
                case 'WhatsNew':
                    toPut = transform.isReadItemWhatsNew(reqBody);
                    initBody['message'] = `${reqBody['notifId']} is set to isRead:${reqBody['isRead']}`;
                    break;

            }

            if (toUpdate === undefined) {
                // put item in dynamodb
                const ret = await writeUserNotif.putDynamo(toPut);
                respBody = initBody;

            } else {
                // update dynamoDB
                const updateExpression = 'attributes = :a, #tp = :t';
                const attributeValue = {
                    ':a': toUpdate,
                    ':t': reqBody['key'],
                    ':eid': req_eid
                };
                const attributeNames = {
                    '#tp': 'type'
                }
                const ret = await writeUserNotif.updateDynamo(req_eid, req_key, updateExpression, attributeValue, attributeNames);

                respBody = ret['Attributes'] === undefined ? {} : initBody;
            }

        }
        return generateResponse(200, respBody);
    } catch (err) {
        console.log(err);
        const statusCode = err.statusCode ? err.statusCode : 500;
        return generateResponse(statusCode, err);
    }
};

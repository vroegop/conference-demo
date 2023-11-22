import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';

const TableName = process.env.DDB_TABLE_NAME;
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}), {marshallOptions: {removeUndefinedValues: true}});

export const handler = async () => {
    const headers = {
        "Access-Control-Allow-Origin": "*", // Or specify the desired origin
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Or any other methods you want to allow
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Specify desired headers
        'Content-Type': 'application/json'
    };

    const Item = {id: new Date().toISOString(), value: 'Hello CDK'};

    await dynamo.send(new PutCommand({TableName, Item}));

    return {
        statusCode: 200,
        body: `Success writing to database: ${JSON.stringify(Item)}`,
        headers
    };
}
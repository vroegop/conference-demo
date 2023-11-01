import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';

const TableName = process.env.DDB_TABLE_NAME;
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}), {marshallOptions: {removeUndefinedValues: true}});

export const handler = async () => {
    const Item = {id: new Date().toISOString(), value: 'Hello CDK'};

    await dynamo.send(new PutCommand({TableName, Item}));

    return {
        statusCode: 200,
        body: `Success writing to database: ${JSON.stringify(Item)}`,
    };
}
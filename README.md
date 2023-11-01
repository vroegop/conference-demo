# conference-demo
Live demo for the conference

> mkdir cdk && cd cdk && cdk init app --language typescript

## Deploy parameters

    env: { region: 'eu-west-1', account: '531843824238' },

## Constructs

```ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontToApiGatewayToLambda } from '@aws-solutions-constructs/aws-cloudfront-apigateway-lambda';
import { LambdaToDynamoDB } from '@aws-solutions-constructs/aws-lambda-dynamodb';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
```

```ts
const lambdaToDynamo = new LambdaToDynamoDB(this, 'test-lambda-dynamodb-stack', {
    lambdaFunctionProps: {
        code: Code.fromAsset(`lambda`),
        runtime: Runtime.NODEJS_18_X,
        handler: 'index.handler'
    },
});
```


```ts
new CloudFrontToApiGatewayToLambda(this, 'test-cloudfront-apigateway-lambda', {
    existingLambdaObj: lambdaToDynamo.lambdaFunction
});
```

## Lambda

```ts
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
```

> npm run build

> cdk deploy
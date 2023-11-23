> $ cdk init app --language=typescript

## App

```ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ConfCdkPipeline } from '../lib/pipeline-stack';

const app = new cdk.App();
new ConfCdkPipeline(app, 'ConfCdkPipeline', {
  env: { region: 'us-west-1', account: '531843824238' },
});
```

## CI/CD pipeline

```ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ConfCdkStack } from './conf-cdk-stack';

export class ConfCdkPipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'ConfCdkPipeline', {
      pipelineName: 'ConfCdkPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('vroegop/conference-demo', 'solution-2'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    pipeline.addStage(new MyPipelineAppStage(this, 'deployConfCdkStacks', props));
  }
}
```

## CI/CD stage

```ts
export class MyPipelineAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new ConfCdkStack(this, 'ConfCdkStack', { env: { ...props?.env }});
    }
}
```

## The API Deployment

```ts
import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaToDynamoDB} from '@aws-solutions-constructs/aws-lambda-dynamodb';
import {Code, Runtime} from 'aws-cdk-lib/aws-lambda';
import {AuthorizationType, Cors, LambdaRestApi} from 'aws-cdk-lib/aws-apigateway';

export class ConfCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const lambdaToDynamo = new LambdaToDynamoDB(this, 'LambdaToDynamoPattern', {
            lambdaFunctionProps: {
                code: Code.fromAsset(`lambda`),
                runtime: Runtime.NODEJS_18_X,
                handler: 'index.handler',
            },
        });

        new LambdaRestApi(this, 'ApiGatewayToLambdaPattern', {
            handler: lambdaToDynamo.lambdaFunction,
            proxy: true,
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: ['*'],
            },
            defaultMethodOptions: {
                authorizationType: AuthorizationType.NONE
            }
        });

        lambdaToDynamo.dynamoTable.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
}
```

> $ npm install @aws-solutions-constructs/aws-lambda-dynamodb

## The API code

```ts
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';

const TableName = process.env.DDB_TABLE_NAME;
const dynamo = DynamoDBDocumentClient.from(
    new DynamoDBClient({}),
    {marshallOptions: {removeUndefinedValues: true}}
);

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
```

> $ aws sso login

> $ cdk deploy
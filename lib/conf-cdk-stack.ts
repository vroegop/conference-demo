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

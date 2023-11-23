import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaToDynamoDB} from '@aws-solutions-constructs/aws-lambda-dynamodb';
import {Code, Runtime} from 'aws-cdk-lib/aws-lambda';
import {ApiGatewayToLambda} from '@aws-solutions-constructs/aws-apigateway-lambda';
import { Cors } from 'aws-cdk-lib/aws-apigateway';

export class ConfCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const lambdaToDynamo = new LambdaToDynamoDB(this, 'LambdaToDynamoPattern', {
      lambdaFunctionProps: {
        code: Code.fromAsset(`lambda`),
        runtime: Runtime.NODEJS_18_X,
        handler: 'index.handler'
      },
    });

    new ApiGatewayToLambda(this, 'ApiGatewayToLambdaPattern', {
      existingLambdaObj: lambdaToDynamo.lambdaFunction,
      apiGatewayProps: {
        proxy: true,
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS,
          allowHeaders: ['*'],
        },
      }
    });

    lambdaToDynamo.dynamoTable.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

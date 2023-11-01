import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CloudFrontToApiGatewayToLambda} from '@aws-solutions-constructs/aws-cloudfront-apigateway-lambda';
import {LambdaToDynamoDB} from '@aws-solutions-constructs/aws-lambda-dynamodb';
import {Code, Runtime} from 'aws-cdk-lib/aws-lambda';
import {AttributeType} from 'aws-cdk-lib/aws-dynamodb';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaToDynamo = new LambdaToDynamoDB(this, 'test-lambda-dynamodb-stack', {
      lambdaFunctionProps: {
        code: Code.fromAsset(`lambda`),
        runtime: Runtime.NODEJS_18_X,
        handler: 'index.handler'
      },
    });

    new CloudFrontToApiGatewayToLambda(this, 'test-cloudfront-apigateway-lambda', {
      existingLambdaObj: lambdaToDynamo.lambdaFunction
    });

    lambdaToDynamo.dynamoTable.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

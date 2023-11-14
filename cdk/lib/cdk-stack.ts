import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Instance, Vpc, InstanceType, InstanceClass, InstanceSize, AmazonLinuxImage } from 'aws-cdk-lib/aws-ec2'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC (required for launching EC2 instance)
    const vpc = new Vpc(this, 'VPC');

    // Define the EC2 instance details
    new Instance(this, 'Instance', {
      vpc,
      instanceType: InstanceType.of(
        InstanceClass.T3,
        InstanceSize.MICRO
      ),
      machineImage: new AmazonLinuxImage(),
    });
  }
}

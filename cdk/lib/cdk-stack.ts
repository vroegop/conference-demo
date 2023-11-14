import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Instance, Vpc, InstanceType, InstanceClass, InstanceSize, AmazonLinuxImage, SubnetType, SecurityGroup, Port, Peer } from 'aws-cdk-lib/aws-ec2'

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the EC2 instance details
    new Instance(this, 'Instance', {
      vpc: new Vpc(this, 'VPC'),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      associatePublicIpAddress: true,
      machineImage: new AmazonLinuxImage(),
      ssmSessionPermissions: true
    });
  }
}

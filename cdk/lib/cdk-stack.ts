import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Instance, Vpc, InstanceType, InstanceClass, InstanceSize, AmazonLinuxImage, SubnetType, SecurityGroup, Port, Peer } from 'aws-cdk-lib/aws-ec2'

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create a new VPC
    const vpc = new Vpc(this, 'MyVpc');

    // Create a security group
    const securityGroup = new SecurityGroup(this, 'SecurityGroup', { vpc, description: 'Allow SSH and HTTPS' });

    // Replace 'ip-address' with your actual IP address
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'Allow SSH access from this IP');
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow HTTPS access from anywhere');


    // Define the EC2 instance details
    new Instance(this, 'Instance', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      associatePublicIpAddress: true,
      machineImage: new AmazonLinuxImage(),
      ssmSessionPermissions: true
    });
  }
}

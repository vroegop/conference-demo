# conference-demo
Live demo for the conference

> mkdir cdk && cd cdk && cdk init app --language typescript

## app

```ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';


const app = new cdk.App();
new CdkStack(app, 'quick-demo-stack', { env: { region: 'eu-west-1', account: '531843824238' } });
```

## lib

```ts
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

```

## test

```ts
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Cdk from '../lib/cdk-stack';

test('SQS Queue Created', () => {
  const app = new cdk.App();
  const stack = new Cdk.CdkStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::Instance', {
    InstanceType: 't3.micro'
  });
});
```

> npm run build

> cdk deploy
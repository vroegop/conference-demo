# conference-demo
Live demo for the conference

> mkdir cdk && cd cdk && cdk init app --language typescript

## Deploy parameters

    env: { region: 'eu-west-1', account: '531843824238' },

## app

```ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'quick-demo-stack', {});
```

## lib

```ts
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
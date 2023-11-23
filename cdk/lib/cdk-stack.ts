import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ConfCdkStack } from './conf-cdk-stack';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'ConfCdkPipeline', {
      pipelineName: 'ConfCdkPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('vroegop/conference-demo', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    pipeline.addStage(new MyPipelineAppStage(this, 'deployConfCdkStacks', props));
  }
}

export class MyPipelineAppStage extends cdk.Stage {

  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new ConfCdkStack(this, 'ConfCdkStack', { env: { ...props?.env }});
  }
}

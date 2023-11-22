import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import {CdkStack} from "./cdk-stack";

export class ConfCdkPipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'ConfCdkPipeline', {
      pipelineName:'ConfCdkPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(`vroegop/conference-demo`, 'solution-2'),
        commands: ['cd cdk', 'npm ci', 'npm run build', 'npm run test', 'npx cdk synth']
      })
    });

    pipeline.addStage(new ConfCdkPipelineStage(this, 'deployConfCdkStacks', props));
  }
}

export class ConfCdkPipelineStage extends cdk.Stage {

  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);

    new CdkStack(this, 'CdkStackDemo', props);
  }
}
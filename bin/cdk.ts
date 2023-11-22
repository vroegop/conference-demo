#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {ConfCdkPipeline} from "../lib/pipeline-stack";

const app = new cdk.App();
new ConfCdkPipeline(app, 'CdkStack', {
    env: { region: 'us-west-1', account: '531843824238' },
});
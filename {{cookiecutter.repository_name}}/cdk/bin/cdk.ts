#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import { EcrStack } from "../lib/ecr-stack";
import { FargateStack } from "../lib/fargate-stack";

const props = {
  repositoryName:
    process.env.CIRCLE_PROJECT_REPONAME || "{{cookiecutter.repository_name}}",
};

// Initiazlie CDK app
const app = new cdk.App();
new EcrStack(app, "EcrStack", props);
new FargateStack(app, "FargateStack", props);

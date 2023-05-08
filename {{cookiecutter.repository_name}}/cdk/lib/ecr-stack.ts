import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as core from "aws-cdk-lib";

export interface Props extends core.StackProps {
  readonly repositoryName: string;
}

export class EcrStack extends core.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    new ecr.Repository(this, "repository", props);
  }
}

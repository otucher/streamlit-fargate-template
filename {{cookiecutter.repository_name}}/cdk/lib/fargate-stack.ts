import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as dotenv from "dotenv";
import * as core from "aws-cdk-lib";
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface Props extends core.StackProps {
  repositoryName: string;
}

export class FargateStack extends core.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    // get image tag from .circleci workspace env file
    dotenv.config({ path: "/tmp/workspace/bashvars" });
    const tag = process.env.GIT_TAG as string;
    if (typeof tag === "undefined")
      throw new TypeError("$GIT_TAG Environment Variable cannot be undefined.");

    // Get repository from CI environment
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "EcrRepository",
      props.repositoryName
    );

    // Get role for task definition access to AWS APIs (secrets, butckets, etc.)
    const taskRole = new iam.Role(this, "TaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    // Fetch hosted zone from AWS
    const zone = new r53.PublicHostedZone(this, "HostedZone", {
      zoneName: "fully.qualified.domain.com",
    });

    // Create fargate
    const service = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      "service",
      {
        taskImageOptions: {
          containerName: props.repositoryName,
          image: ecs.ContainerImage.fromEcrRepository(repository, tag),
          taskRole,
          containerPort: 8501,
        },
        cpu: 512,
        desiredCount: 2,
        domainName: `${props.repositoryName.toLowerCase()}.com`,
        domainZone: zone,
        listenerPort: 443,
        memoryLimitMiB: 2048,
        publicLoadBalancer: true,
        redirectHTTP: true,
        sslPolicy: elbv2.SslPolicy.TLS12_EXT,
        propagateTags: ecs.PropagatedTagSource.SERVICE,
      }
    );

    // set-up auto scaling scaling
    const scalableTarget = service.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });
    scalableTarget.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 75,
    });
    scalableTarget.scaleOnMemoryUtilization("MemoryScaling", {
      targetUtilizationPercent: 75,
    });
  }
}

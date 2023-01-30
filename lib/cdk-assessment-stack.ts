import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkAssessmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAssessmentQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2
    });
    // Create an ECR repository
    const repository = new ecr.Repository(this, 'MyRepository', {
      repositoryName: 'my-node-app'
    });
    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTaskDefinition');

    const container = taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromRegistry('nginx:alpine'),
      memoryLimitMiB: 512,
      environment: {
        NODE_ENV: 'production'
      }
    });
    
    container.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP
    });    

    // Create a service and run 1 task
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 1,
    });

  }
}

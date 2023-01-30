import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkAssessmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2
    });

    // Create an ECR repository
    // const repository = new ecr.Repository(this, 'MyRepository', {
    //   repositoryName: 'my-django-app'
    // });

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc
    });

    // Create ExecutionRole
    const executionRole = new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
    });

    // Create TaskDefinition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTaskDefinition', {
      executionRole,
      memoryLimitMiB: 1024,
      cpu: 512
    });

    // Add container
    const container = taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromRegistry('469581778874.dkr.ecr.us-east-1.amazonaws.com/my-django-app:latest'),
      memoryLimitMiB: 1024,
      cpu: 512,
      environment: {
        ENV: 'production'
      },
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'my-django-app'
      }),
    });
    
    // Port mapping
    container.addPortMappings({
      containerPort: 8000,
      hostPort: 8000,
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

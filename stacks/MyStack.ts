import { StackContext, Api } from "sst/constructs";
import {
  LayerVersion,
  Code,
  Runtime,
  Architecture,
} from "aws-cdk-lib/aws-lambda";

const layerArn =
  "arn:aws:lambda:us-east-1:864519500695:layer:chromium-lambda-layer:1";

export function API({ stack }: StackContext) {
  const chromiumLayer = new LayerVersion(stack, "sparticuz-chromium", {
    code: Code.fromAsset(
      "packages/layers/@sparticuz-chromium"
    ),
    compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
    compatibleArchitectures: [Architecture.X86_64],
  });
  const api = new Api(stack, "api", {
    routes: {
      "GET /": {
        function: {
          handler: "packages/functions/src/lambda.handler",
          timeout: 30,
          nodejs: {
            esbuild: {
              external: ["@sparticuz/chromium"],
            },
            install: ["@sparticuz/chromium"],
          },
          layers: [chromiumLayer],
        },
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}

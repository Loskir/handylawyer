import { createDataStreamResponse, formatDataStreamPart, Message } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const deploymentResponse = await fetch('https://my.orq.ai/v2/deployments/invoke', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env["ORQ_API_KEY"] ?? ""}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      key: "LegalFrontierHackathonDeploymentKey",
      context: {
        environments: []
      },
      metadata: {
        "custom-field-name": "custom-metadata-value"
      },
      messages
    })
  });

  const deployment = await deploymentResponse.json();
  console.log(deployment.choices[0].message.content);

  // Return a streaming response
  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.write(formatDataStreamPart("text", deployment.choices[0].message.content));
    }
  });
} 
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

  try {

    const body = JSON.parse(event.body);

    const originalUrl = body.url;

    const code = Math.random().toString(36).substring(2, 8);

    await docClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        code,
        originalUrl,
        createdAt: new Date().toISOString(),
        clicks: 0,
        visits: []
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        shortUrl: `${process.env.API_URL}/${code}`,
        code
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
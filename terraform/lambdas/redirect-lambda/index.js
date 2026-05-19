const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

  try {

    const code = event.pathParameters.codigo;

    const result = await docClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        code
      }
    }));

    if (!result.Item) {

      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "URL no encontrada"
        })
      };
    }

    const today = new Date().toISOString().split("T")[0];

    await docClient.send(new UpdateCommand({

      TableName: process.env.TABLE_NAME,

      Key: {
        code
      },

      UpdateExpression: `
        SET clicks = clicks + :inc,
            visits = list_append(visits, :visit)
      `,

      ExpressionAttributeValues: {
        ":inc": 1,
        ":visit": [today]
      }
    }));

    return {
      statusCode: 302,

      headers: {
        Location: result.Item.originalUrl
      }
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
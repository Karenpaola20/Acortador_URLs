const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

  try {

    const code = event.pathParameters.codigo;

    const queryDate = event.queryStringParameters?.date;

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

    let filteredVisits = result.Item.visits;

    // FILTRAR POR FECHA
    if (queryDate) {

      filteredVisits = result.Item.visits.filter(
        visit => visit === queryDate
      );
    }

    return {
      statusCode: 200,

      body: JSON.stringify({
        code: result.Item.code,
        originalUrl: result.Item.originalUrl,
        totalClicks: result.Item.clicks,
        visits: filteredVisits,
        filteredDate: queryDate || null
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
resource "aws_lambda_function" "shortener_lambda" {
  function_name = "shortener-lambda"

  runtime           = "nodejs20.x"
  handler           = "index.handler"
  
  filename          = "${path.module}/lambdas/url-shortener-lambda/lambda.zip"
  source_code_hash  = filebase64sha256("${path.module}/lambdas/url-shortener-lambda/lambda.zip")

  role              = aws_iam_role.lambda_role.arn

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.urls_table.name
    }
  }
}

resource "aws_lambda_permission" "api_gateway" {

  statement_id = "AllowExecutionFromAPIGateway"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.shortener_lambda.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.shortener_api.execution_arn}/*/*"
}
resource "aws_apigatewayv2_api" "shortener_api" {
    name = "shortener-api"

    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  
  api_id = aws_apigatewayv2_api.shortener_api.id
  
  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.shortener_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "post_shorten" {

  api_id = aws_apigatewayv2_api.shortener_api.id

  route_key = "POST /shorten"

  target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {

  api_id = aws_apigatewayv2_api.shortener_api.id

  name = "$default"

  auto_deploy = true
}
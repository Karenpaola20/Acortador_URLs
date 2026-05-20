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

// Aqui el Redireccionamiento
resource "aws_apigatewayv2_integration" "redirect_integration" {
  
  api_id = aws_apigatewayv2_api.shortener_api.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.redirect_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "redirect_route" {

  api_id = aws_apigatewayv2_api.shortener_api.id

  route_key = "GET /{codigo}"

  target = "integrations/${aws_apigatewayv2_integration.redirect_integration.id}"
}

// Aqui el stats
resource "aws_apigatewayv2_integration" "stats_integration" {
  
  api_id = aws_apigatewayv2_api.shortener_api.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.stats_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "stats_route" {

  api_id = aws_apigatewayv2_api.shortener_api.id

  route_key = "GET /stats/{codigo}"

  target = "integrations/${aws_apigatewayv2_integration.stats_integration.id}"
}
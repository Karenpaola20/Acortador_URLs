resource "aws_dynamodb_table" "urls_table" {
    name = "urls"
    billing_mode = "PAY_PER_REQUEST"

    hash_key = "code"

    attribute {
      name = "code"
      type = "S"
    }
}
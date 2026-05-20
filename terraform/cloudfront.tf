resource "aws_cloudfront_distribution" "frontend_cdn" {

  enabled = true

  origin {

    domain_name = aws_s3_bucket_website_configuration.frontend_website.website_endpoint

    origin_id = "frontendS3"

    custom_origin_config {

      http_port = 80

      https_port = 443

      origin_protocol_policy = "http-only"

      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {

    allowed_methods = ["GET", "HEAD"]

    cached_methods = ["GET", "HEAD"]

    target_origin_id = "frontendS3"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {

      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {

    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
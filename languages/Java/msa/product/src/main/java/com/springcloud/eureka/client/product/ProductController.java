package com.springcloud.eureka.client.product;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RefreshScope // application설정 값이 업데이트될 수 있게 됨(@Value)
@RestController
public class ProductController {

  @Value("${server.port}") // 애플리케이션이 실행 중인 포트를 주입받습니다.
  private String serverPort;

  @Value("${message}")
  private String message;

  @GetMapping("/product")
  public String getProduct() {
    return "Product detail from PORT : " + serverPort + " and message : " + this.message;
  }
  //  @GetMapping("/product/{id}")
  //  public String getProduct(@PathVariable String id) {
  //    return "Product " + id + " info!!!!! From port : " + serverPort;
  //  }
}

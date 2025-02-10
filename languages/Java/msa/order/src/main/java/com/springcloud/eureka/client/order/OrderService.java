package com.springcloud.eureka.client.order;

import org.springframework.stereotype.Service;

@Service
public class OrderService {
  private final ProductClient productClient;

  public OrderService(ProductClient productClient) {
    this.productClient = productClient;
  }

  public String getOrder(String orderId) {
    if (orderId.equals("1")) {
      String productId = "2";
      String productInfo = this.getProductInfo(productId);

      return "Your order is " + orderId + " and " + productInfo;
    }
    return "Not exist order";
  }

  private String getProductInfo(String productId) {
    return productClient.getProduct(productId);
  }
}

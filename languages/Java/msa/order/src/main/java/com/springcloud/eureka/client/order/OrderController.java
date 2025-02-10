package com.springcloud.eureka.client.order;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  //  @GetMapping("/order")
  //  public String getOrder() {
  //    return "Order Detail";
  //  }

  @GetMapping("/order/{orderId}")
  public String getOrder(@PathVariable("orderId") String orderId) {
    return orderService.getOrder(orderId);
  }
}

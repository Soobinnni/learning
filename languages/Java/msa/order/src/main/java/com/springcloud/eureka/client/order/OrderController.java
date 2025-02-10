package com.springcloud.eureka.client.order;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderController {

  //  private final OrderService orderService;

  @GetMapping("/order")
  public String getOrder() {
    return "Order Detail";
  }

  //    @GetMapping("/order/{orderId}")
  //    public String getOrder(@PathVariable("orderId") String orderId) {
  //        return orderService.getOrder(orderId);
  //    }

}

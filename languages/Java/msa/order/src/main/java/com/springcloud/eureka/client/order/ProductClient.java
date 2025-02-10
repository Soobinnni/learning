package com.springcloud.eureka.client.order;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// product-service로 이름이 등록되어 있는 유레카 서비스에서 인스턴스를 찾음
@FeignClient("product-service")
public interface ProductClient {
    @GetMapping("/product/{id}")
    String getProduct(@PathVariable("id") String id);

}

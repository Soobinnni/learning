package com.springcloud.eureka.client.gateway;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.logging.Logger;

/**
 * Post 필터는 요청이 처리된 후, 응답이 반환되기 전에 실행.
 * Post 필터에서는 체인의 다음 필터가 완료된 후에 실행되어야 하는 추가적인 작업을 수행해야 함.
 * 따라서 chain.filter(exchange)를 호출하여 다음 필터를 실행한 후,
 *       then 메서드를 사용하여 응답이 완료된 후에 실행할 작업을 정의.
 */
@Component
public class CustomPostFilter implements GlobalFilter, Ordered {

    private static final Logger logger = Logger.getLogger(CustomPostFilter.class.getName());

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            logger.info("Post Filter: Response status code is " + response.getStatusCode());
            // Add any custom logic here
        }));
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
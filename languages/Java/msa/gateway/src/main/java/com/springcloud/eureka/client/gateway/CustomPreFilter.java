package com.springcloud.eureka.client.gateway;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.logging.Logger;

/**
 * Pre 필터는 요청이 처리되기 전에 실행. 
 * 따라서 Pre 필터에서는 요청을 가로채고 필요한 작업을 수행한 다음, 체인의 다음 필터로 요청을 전달. 
 * 이때, 추가적인 비동기 작업을 수행할 필요가 없기 때문에 then 메서드를 사용할 필요가 없음.
 */
@Component
public class CustomPreFilter implements GlobalFilter, Ordered {

    private static final Logger logger = Logger.getLogger(CustomPreFilter.class.getName());

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest response = exchange.getRequest();
        logger.info("Pre Filter: Request URI is " + response.getURI());
        // Add any custom logic here

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        // 최상위 순서
        return Ordered.HIGHEST_PRECEDENCE;
    }
}


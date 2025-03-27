# 낙관적 락(Optimistic Locking)의 동작 방식

낙관적 락은 트랜잭션 간의 충돌을 최소화하고 성능을 향상시키기 위해 사용되는 동시성 제어 메커니즘이다. 비관적 락이 데이터베이스 레벨에서 락을 걸어 다른 트랜잭션의 접근을 차단하는 방식이라면, 낙관적 락은 데이터베이스 락을 사용하지 않고, 대신 데이터가 변경되었는지 확인하여 충돌을 처리하는 방식이다.

## 버전 관리

* 낙관적 락에서는 보통 version이라는 필드를 엔티티에 추가한다. 이 필드는 해당 엔티티의 수정 횟수를 추적하는 역할을 한다.
* 트랜잭션이 엔티티를 읽을 때, 현재의 버전 번호가 함께 읽혀온다.
* 트랜잭션이 엔티티를 수정하고 저장하려고 할 때, 현재 데이터베이스에 저장된 버전 번호와 트랜잭션이 처음 읽어온 버전 번호를 비교한다.

## 데이터 충돌 검출

* 트랜잭션이 데이터를 저장할 때, 데이터베이스에 저장된 버전 번호가 트랜잭션이 처음 읽어온 버전 번호와 동일하다면, 데이터가 수정되지 않았다고 간주하고 업데이트를 수행한다. 이때 버전 번호는 증가한다.
* 반면, 버전 번호가 다르면, 다른 트랜잭션이 데이터를 수정한 것으로 간주하고, 현재 트랜잭션을 롤백하거나 재시도하도록 한다.

## 낙관적 락의 장단점

### 장점

* **성능**: 비관적 락에 비해 성능이 뛰어나다. 데이터베이스에서 락을 걸지 않으므로 병행 처리 성능이 향상된다.
* **유연성**: 충돌이 발생했을 때, 비즈니스 로직에 따라 트랜잭션을 재시도하거나 롤백할 수 있다.

### 단점

* **충돌 가능성**: 데이터가 자주 변경되는 경우, 충돌이 자주 발생할 수 있다. 이로 인해 여러 번의 재시도가 필요할 수 있다.
* **복잡성**: 충돌을 처리하기 위한 로직이 추가로 필요할 수 있다.

## 구현 예시

### JPA에서의 낙관적 락 구현

```java
@Entity
public class Product {
    @Id
    private Long id;
    
    private String name;
    private BigDecimal price;
    
    @Version
    private Long version;
    
    // getter, setter 등
}
```

### 서비스 계층에서의 낙관적 락 처리

```java
@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public void updateProductPrice(Long productId, BigDecimal newPrice) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ProductNotFoundException(productId));
        
        product.setPrice(newPrice);
        
        try {
            productRepository.save(product); // 버전이 다르면 예외 발생
        } catch (OptimisticLockingFailureException e) {
            // 충돌 처리 로직
            throw new ConcurrentModificationException("제품이 다른 사용자에 의해 이미 수정되었습니다. 다시 시도해주세요.");
        }
    }
    
    // 충돌 발생 시 재시도 로직 예시
    @Retryable(
        value = OptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 100)
    )
    public void updateProductPriceWithRetry(Long productId, BigDecimal newPrice) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ProductNotFoundException(productId));
        
        product.setPrice(newPrice);
        productRepository.save(product);
    }
}
```

## 낙관적 락의 활용 상황

* **읽기가 많고 쓰기가 적은 환경**: 대부분의 작업이 읽기 작업이고, 실제 데이터 수정은 드물게 일어나는 환경에서 유용하다.
* **충돌 가능성이 낮은 환경**: 여러 사용자가 동시에 같은 데이터를 수정할 가능성이 적은 경우에 적합하다.
* **높은 병행성이 요구되는 환경**: 높은 처리량이 요구되고 락으로 인한 대기 시간을 최소화해야 하는 경우에 적합하다.

## 주의사항

* **충돌 처리 전략 설계**: 낙관적 락에서 충돌이 발생했을 때의 처리 전략을 명확히 설계해야 한다. 단순히 예외를 발생시키는 것보다 재시도 메커니즘이나 사용자에게 명확한 피드백을 제공하는 것이 중요하다.
* **버전 필드 관리**: 버전 필드는 자동으로 관리되어야 하며, 수동으로 변경하지 않도록 주의해야 한다.
* **복잡한 업데이트 처리**: 여러 레코드를 한 번에 업데이트하는 경우, 각 레코드의 버전을 개별적으로 확인해야 한다.

낙관적 락은 데이터베이스 락을 최소화하면서도 데이터 일관성을 유지할 수 있는 효과적인 방법이다. 특히, 데이터 충돌이 적고 병행 처리가 많은 시스템에서 유용하게 사용할 수 있다. 하지만 충돌이 발생했을 때의 처리 로직을 잘 설계해야 하며, 특정 상황에서는 비관적 락보다 복잡할 수 있다.
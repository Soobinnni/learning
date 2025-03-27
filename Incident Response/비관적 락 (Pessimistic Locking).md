# 비관적 락(Pessimistic Locking)의 동작 방식

## 락의 개념

비관적 락은 데이터에 대한 접근을 제어하기 위해 사용된다. 데이터베이스에서 특정 행(row)이나 테이블에 대해 락을 걸어, 다른 트랜잭션이 동시에 동일한 데이터에 접근하거나 수정하지 못하도록 한다.

## 락의 종류

* **PESSIMISTIC_READ**: 읽기 락(Shared Lock)을 설정하여 다른 트랜잭션이 해당 데이터를 읽을 수는 있지만, 수정은 할 수 없도록 한다.
* **PESSIMISTIC_WRITE**: 쓰기 락(Exclusive Lock)을 설정하여 다른 트랜잭션이 해당 데이터를 읽거나 수정하지 못하도록 한다.

## DB 레벨에서의 락 동작

* **락 설정**: 비관적 락을 사용하면 SQL 쿼리나 트랜잭션이 데이터베이스에 접근할 때 락이 설정된다. 예를 들어, PESSIMISTIC_WRITE 락을 설정하면, 해당 데이터에 대한 모든 읽기 및 쓰기 작업이 락이 해제될 때까지 대기하게 된다.
* **락 해제**: 락은 일반적으로 트랜잭션이 종료되거나 커밋될 때 해제된다. 트랜잭션이 커밋되면 락이 해제되어 다른 트랜잭션이 해당 데이터에 접근할 수 있게 된다. 트랜잭션이 롤백되는 경우에도 락이 해제된다.

## 비관적 락의 특징

* 비관적 락은 주로 데이터베이스 레벨에서 동작하며, 데이터의 무결성을 보장하는 데 매우 유용하다.
* 데이터 충돌 가능성이 높은 환경에서 데이터 일관성을 유지하는 데 효과적이다.
* 성능에 영향을 미칠 수 있으므로, 충돌 가능성이 높은 환경에서 신중하게 사용해야 한다.
* 스프링 부트와 같은 애플리케이션에서 비관적 락을 설정하면, 데이터베이스가 이 락을 처리하고 관리하게 된다.

## 구현 예시

### JPA에서의 비관적 락 사용

```java
@Service
@Transactional
public class AccountService {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    // 읽기 락 사용 예시
    public Account findAccountWithPessimisticRead(Long id) {
        return entityManager.find(Account.class, id, LockModeType.PESSIMISTIC_READ);
    }
    
    // 쓰기 락 사용 예시
    public Account findAccountWithPessimisticWrite(Long id) {
        return entityManager.find(Account.class, id, LockModeType.PESSIMISTIC_WRITE);
    }
    
    // 쿼리에서 락 사용 예시
    public Account findAccountByNumberWithLock(String accountNumber) {
        return entityManager.createQuery(
                "SELECT a FROM Account a WHERE a.accountNumber = :accountNumber", 
                Account.class)
                .setParameter("accountNumber", accountNumber)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .getSingleResult();
    }
    
    // 트랜잭션 내에서 계좌 이체 예시 (쓰기 락 사용)
    public void transferMoney(Long fromAccountId, Long toAccountId, BigDecimal amount) {
        Account fromAccount = findAccountWithPessimisticWrite(fromAccountId);
        Account toAccount = findAccountWithPessimisticWrite(toAccountId);
        
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("잔액이 부족합니다.");
        }
        
        fromAccount.debit(amount);
        toAccount.credit(amount);
        
        // 트랜잭션이 끝나면 자동으로 락이 해제됨
    }
}
```

## 주의사항

1. **데드락 위험**: 여러 트랜잭션이 서로 다른 순서로 락을 획득하려고 할 때 데드락이 발생할 수 있다. 항상 일관된 순서로 락을 획득하는 것이 좋다.
2. **타임아웃 설정**: 락 획득 시 타임아웃을 설정하여 무한정 대기하는 상황을 방지한다.
3. **성능 고려**: 비관적 락은 동시성을 제한하므로 시스템 처리량에 영향을 줄 수 있다. 충돌 가능성이 낮은 경우 낙관적 락을 고려한다.
4. **락 범위 최소화**: 필요한 데이터에만 락을 적용하여 락의 범위를 최소화한다.
## DB Lock 이란?

DB 락(Database Lock)은 데이터베이스에서 여러 트랜잭션이 동시에 같은 데이터에 접근할 때, 데이터의 무결성(일관성)을 보장하기 위해 사용되는 메커니즘이다. 쉽게 말해, 한 트랜잭션이 특정 데이터에 대해 작업을 하고 있을 때 다른 트랜잭션이 그 데이터에 접근하지 못하도록 잠그는 것이다. 이로써 데이터의 일관성을 유지하고, 동시에 발생할 수 있는 충돌을 방지할 수 있다.

## DB Lock의 필요성

데이터베이스는 여러 사용자나 시스템이 동시에 데이터를 읽고 쓰는 환경에서 운영된다. 이런 환경에서 문제가 발생할 수 있는 대표적인 사례는 다음과 같다:

### Dirty Read (더티 리드)

한 트랜잭션이 데이터를 수정 중일 때 다른 트랜잭션이 그 데이터를 읽는 상황. 만약 첫 번째 트랜잭션이 롤백된다면, 두 번째 트랜잭션은 잘못된 데이터를 읽은 것이 된다.

> **예시:**
> 1. **트랜잭션 A**가 고객의 은행 계좌 잔액을 수정하고 1000원을 더한다. 잔액이 5000원에서 6000원으로 변경된다. 하지만 트랜잭션 A는 아직 이 변경을 커밋하지 않았다.
> 2. **트랜잭션 B**가 같은 고객의 계좌 잔액을 조회하여 6000원이라고 읽는다. 트랜잭션 B는 이 잔액을 기반으로 다른 계산을 수행한다.
> 3. **트랜잭션 A**가 예기치 않은 오류로 인해 롤백되어, 잔액은 다시 5000원으로 되돌아간다.
> 4. 그러나 **트랜잭션 B**는 이미 잘못된 6000원을 읽었으므로, 이로 인해 부정확한 계산이 발생할 수 있다.

### Non-repeatable Read (반복 불가능한 읽기)

한 트랜잭션이 데이터를 읽은 후, 다른 트랜잭션이 그 데이터를 수정하고 커밋하여 첫 번째 트랜잭션이 동일한 데이터를 다시 읽을 때 값이 달라지는 상황이다.

> **예시:**
> 1. **트랜잭션 A**가 고객의 계좌 잔액을 읽는다. 이때 계좌 잔액은 5000원이다.
> 2. **트랜잭션 B**가 같은 고객의 계좌 잔액을 7000원으로 수정하고 커밋한다.
> 3. **트랜잭션 A**가 동일한 고객의 계좌 잔액을 다시 읽는다. 이번에는 잔액이 7000원으로 표시된다.
> 4. **트랜잭션 A**는 같은 트랜잭션 내에서 동일한 데이터를 두 번 읽었지만, 그 값이 일관되지 않게 변경된 것을 확인한다.

### Lost Update (업데이트 손실)

두 개의 트랜잭션이 동시에 같은 데이터를 수정하려고 할 때, 한 트랜잭션의 수정 내용이 다른 트랜잭션에 의해 덮어쓰여져 사라지는 상황이다.

> **예시:**
> 1. **트랜잭션 A**가 고객의 계좌 잔액을 5000원에서 6000원으로 수정한다. 하지만 아직 커밋하지 않았다.
> 2. **트랜잭션 B**도 같은 고객의 계좌 잔액을 5000원에서 7000원으로 수정하고, 즉시 커밋한다.
> 3. **트랜잭션 A**가 자신의 변경 사항을 커밋한다.
> 4. 결과적으로 계좌 잔액은 6000원으로 저장된다. 그러나 **트랜잭션 B**가 먼저 커밋한 7000원으로의 변경은 사라져 버렸다. 이 상황을 업데이트 손실이라고 한다.

DB 락을 통해 데이터에 대한 접근을 제어하면, 위와 같은 상황에서 발생할 수 있는 데이터 무결성 문제를 예방할 수 있다.

## DB 락의 종류

### 공유 락 (Shared Lock, S Lock)

공유 락은 데이터베이스에서 데이터를 읽을 때 사용된다. 여러 트랜잭션이 동시에 같은 데이터를 읽을 수 있지만, 공유 락이 걸린 동안에는 데이터를 수정할 수 없다.

> **상황:** 고객 정보 시스템에서 여러 직원이 동시에 같은 고객의 정보를 조회할 수 있지만, 조회 중에는 그 정보를 수정할 수 없다.
>
> **예시:**
> - **트랜잭션 A**가 고객 A의 정보를 조회한다. 이때 고객 A의 정보에 대해 공유 락이 걸린다.
> - **트랜잭션 B**도 동시에 고객 A의 정보를 조회한다. 공유 락이 이미 걸려 있으므로, 트랜잭션 B는 정상적으로 고객 정보를 읽을 수 있다.
> - **트랜잭션 C**가 고객 A의 정보를 수정하려고 시도한다. 하지만 공유 락 때문에 수정 작업이 차단되거나 대기 상태가 된다.
> - 트랜잭션 A와 B가 조회를 끝내고 공유 락이 해제된 후에야 트랜잭션 C가 고객 정보를 수정할 수 있다.

### 배타 락 (Exclusive Lock, X Lock)

배타 락은 데이터를 수정할 때 사용된다. 배타 락이 걸린 데이터는 다른 트랜잭션이 읽거나 수정할 수 없다. 한 트랜잭션이 배타 락을 획득하면 다른 모든 트랜잭션은 해당 데이터에 접근할 수 없다.

> **상황:** 재고 관리 시스템에서 한 직원이 특정 상품의 재고를 수정하고 있을 때, 다른 직원이 그 상품의 재고를 조회하거나 수정하지 못하게 하는 상황.
>
> **예시:**
> - **트랜잭션 A**가 상품 A의 재고를 100에서 150으로 수정하려고 한다. 이때 상품 A에 대해 배타 락이 걸린다.
> - **트랜잭션 B**가 상품 A의 재고를 조회하려고 하지만, 배타 락 때문에 대기 상태가 된다.
> - **트랜잭션 C**가 상품 A의 재고를 150에서 200으로 수정하려고 하지만, 마찬가지로 대기 상태가 된다.
> - 트랜잭션 A가 재고 수정 작업을 완료하고 커밋한 후, 락이 해제되면 트랜잭션 B와 C가 차례로 진행될 수 있다.

### 비관적 락 (Pessimistic Locking)

비관적 락은 데이터를 읽을 때부터 락을 걸어 다른 트랜잭션이 접근하지 못하도록 하는 방식이다. 데이터의 충돌 가능성이 높을 때 유용하다.

> **상황:** 은행 시스템에서 한 사용자가 특정 계좌의 잔액을 조회하고 수정하려는 시나리오에서, 다른 사용자가 이 계좌에 접근하지 못하게 하는 방식.
>
> **예시:**
> - **트랜잭션 A**가 고객 A의 계좌 잔액을 조회하고 수정하려고 한다. 이때 비관적 락을 사용하여 잔액에 대한 락을 걸고, 다른 트랜잭션의 접근을 차단한다.
> - **트랜잭션 B**가 같은 계좌의 잔액을 조회하려고 하지만, 비관적 락 때문에 대기 상태가 된다.
> - 트랜잭션 A가 계좌 잔액을 수정하고 커밋한 후, 락이 해제되면 트랜잭션 B가 잔액을 조회할 수 있다.

### 낙관적 락 (Optimistic Locking)

낙관적 락은 데이터를 수정하기 전까지 락을 걸지 않고, 수정 시점에만 충돌을 확인하는 방식이다. 주로 데이터의 버전 번호를 사용하여 동시성 문제를 해결한다.

> **상황:** 온라인 쇼핑몰에서 여러 사용자가 동시에 동일한 상품의 정보를 수정할 수 있는 상황에서, 수정 시점에 충돌을 감지하여 해결하는 방식.
>
> **예시:**
> - **트랜잭션 A**와 **트랜잭션 B**가 동시에 상품 A의 가격을 수정하려고 한다. 상품 A의 현재 버전은 1이다.
> - 트랜잭션 A는 상품 가격을 5만원으로 수정하고, 버전을 2로 증가시켜 저장한다.
> - 트랜잭션 B는 상품 가격을 6만원으로 수정하려고 하지만, 저장 시점에 버전 충돌이 발생한다. 트랜잭션 B는 버전 1이 아닌 2를 발견하므로, 예외를 발생시키거나 변경 작업을 재시도해야 한다.

### 명명된 락 (Named Lock)

명명된 락은 데이터베이스에서 특정 이름으로 락을 설정하여, 동시에 하나의 프로세스만 특정 리소스에 접근하도록 하는 방식이다. 주로 특정 리소스나 작업에 대한 접근을 직관적으로 제어하기 위해 사용된다.

> **상황:** PostgreSQL에서 특정 보고서를 생성하는 작업에 대해 이름 기반으로 락을 걸어, 두 명의 사용자가 동시에 같은 보고서를 생성하지 못하게 하는 상황.
>
> **예시:**
> - **트랜잭션 A**가 "월간 보고서 생성"이라는 이름으로 **명명된 락**을 설정하고 보고서 생성을 시작한다.
> - **트랜잭션 B**도 "월간 보고서 생성"을 시도하지만, 트랜잭션 A가 락을 걸고 있으므로 대기 상태가 된다.
> - 트랜잭션 A가 보고서 생성을 완료하고 **명명된 락**을 해제하면, 트랜잭션 B가 보고서 생성을 시작할 수 있다.

### 분산 락 (Distributed Lock)

분산 락은 여러 시스템이나 인스턴스에서 동시에 동일한 자원에 접근할 때, 자원의 일관성을 유지하기 위해 사용되는 락이다. Redis와 같은 분산 시스템을 사용하여 구현된다.

> **상황:** 온라인 예약 시스템에서 여러 서버 인스턴스가 동일한 좌석을 동시에 예약하지 못하도록 하는 상황.
>
> **예시:**
> - **인스턴스 A**가 공연 좌석 10번에 대해 예약을 시도하고, Redis를 사용하여 분산 락을 설정한다.
> - **인스턴스 B**도 동일한 좌석 10번을 예약하려고 시도하지만, 인스턴스 A가 락을 걸고 있으므로 예약이 실패하거나 대기 상태가 된다.
> - 인스턴스 A가 예약을 완료하고 락을 해제하면, 인스턴스 B는 다음 예약을 시도할 수 있다.
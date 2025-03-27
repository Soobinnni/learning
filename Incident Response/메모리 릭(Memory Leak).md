# 메모리 릭(Memory Leak)의 이해와 해결 방법

## 메모리 릭이란?

메모리 릭(Memory Leak)은 프로세스가 더 이상 필요하지 않은 메모리를 할당한 후 이를 해제하지 않음으로써, 해당 메모리가 지속적으로 점유된 상태로 남아있는 현상을 말한다. 이러한 메모리 릭은 메모리 사용량을 지속적으로 증가시켜, 결국에는 시스템의 메모리를 고갈시켜 성능 저하 또는 애플리케이션의 충돌을 유발할 수 있다.

## 메모리 릭의 일반적인 원인

### 이벤트 리스너나 콜백의 등록 후 해제되지 않음

이벤트 리스너를 등록한 후 이를 해제하지 않으면, 해당 객체가 계속 메모리에 남아 있게 되어 메모리 릭이 발생할 수 있다.

```java
// 잘못된 예시
public class EventManager {
    private static List<EventListener> listeners = new ArrayList<>();
    
    public static void addListener(EventListener listener) {
        listeners.add(listener);
    }
    
    // removeListener 메서드가 없거나 호출되지 않음
}
```

### 전역 변수 사용

전역 변수로 객체를 참조하게 되면, 해당 객체가 프로그램의 종료 시점까지 해제되지 않을 수 있다.

```java
// 잘못된 예시
public class GlobalCache {
    private static Map<String, Object> cache = new HashMap<>();
    
    public static void put(String key, Object value) {
        cache.put(key, value);
    }
    
    // 캐시 항목을 제거하는 로직이 없음
}
```

### 캐시 관리 실패

캐시된 객체가 필요 없을 때도 계속해서 메모리에 유지되면 메모리 릭이 발생할 수 있다.

```java
// 잘못된 예시
@Service
public class ProductService {
    private Map<String, Product> productCache = new HashMap<>();
    
    public Product getProduct(String id) {
        if (!productCache.containsKey(id)) {
            Product product = loadFromDatabase(id);
            productCache.put(id, product); // 캐시 항목이 계속 증가함
        }
        return productCache.get(id);
    }
    
    // 캐시 크기 제한이나 만료 정책이 없음
}
```

### 잘못된 데이터 구조 관리

예를 들어, 객체를 저장한 후 필요하지 않게 되었을 때 제거하지 않으면, 메모리 릭이 발생할 수 있다.

```java
// 잘못된 예시
@Component
public class RequestTracker {
    private List<Request> allRequests = new ArrayList<>();
    
    public void trackRequest(Request request) {
        allRequests.add(request);
    }
    
    // 오래된 요청을 정리하는 로직이 없음
}
```

## 스프링(Spring)에서의 메모리 릭

### 스프링 빈의 라이프사이클 관리 문제

스프링에서는 기본적으로 싱글톤(Singleton) 스코프의 빈(Bean)을 사용한다. 이 빈은 애플리케이션 컨텍스트가 살아있는 동안 메모리에 유지된다. 만약 싱글톤 빈이 내부적으로 많은 메모리를 점유하는 객체를 가지고 있다면, 이 객체들이 계속 메모리에 남아 메모리 릭을 유발할 수 있다.

예를 들어, 캐시나 컬렉션에 데이터를 추가한 후 이를 명시적으로 제거하지 않으면, 메모리가 점점 증가할 수 있다.

```java
@Service
public class DataService {
    private Map<String, Object> dataCache = new HashMap<>();
    
    public void processData(String key, Object data) {
        // 데이터 처리 로직
        dataCache.put(key, data); // 지속적으로 데이터 추가
    }
}
```

### @Autowired 주입된 객체의 잘못된 관리

@Autowired로 주입된 객체가 예상치 못한 참조 순환을 일으키거나, 의도적으로 제거되지 않는다면 메모리 릭을 일으킬 수 있다. 이는 주로 개발자가 객체의 라이프사이클을 명확하게 이해하지 못했을 때 발생한다.

```java
@Component
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
}

@Component
public class ServiceB {
    @Autowired
    private ServiceA serviceA;
    // 순환 참조가 발생하여 메모리 릭 가능성
}
```

### ThreadLocal의 잘못된 사용

ThreadLocal을 사용하여 스레드별로 데이터를 저장하는 경우, 스레드가 종료되면 해당 스레드와 관련된 모든 데이터를 제거해야 한다. 그러나 이를 명시적으로 제거하지 않으면 메모리 릭이 발생할 수 있다.

특히 스프링에서는 요청 스코프의 빈을 ThreadLocal로 처리하는 경우가 있는데, 요청이 종료될 때 이 데이터를 적절히 정리하지 않으면 메모리 릭이 발생할 수 있다.

```java
@Component
public class UserContextHolder {
    private static final ThreadLocal<UserContext> userContext = new ThreadLocal<>();
    
    public static void setUserContext(UserContext context) {
        userContext.set(context);
    }
    
    public static UserContext getUserContext() {
        return userContext.get();
    }
    
    // clear 메서드가 호출되지 않으면 메모리 릭 발생 가능
    public static void clear() {
        userContext.remove();
    }
}
```

### 이벤트 리스너의 잘못된 관리

스프링 애플리케이션에서 이벤트 리스너를 등록한 후, 이 리스너가 더 이상 필요하지 않은 경우 제거해야 한다. 그렇지 않으면 리스너가 계속해서 메모리를 점유하게 되어 메모리 릭을 유발할 수 있다.

```java
@Component
public class EventListenerComponent implements ApplicationListener<ApplicationEvent> {
    private List<CustomListener> listeners = new ArrayList<>();
    
    public void registerListener(CustomListener listener) {
        listeners.add(listener);
    }
    
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        // 이벤트 처리
    }
    
    // 리스너 제거 로직이 없음
}
```

## ThreadLocal을 사용한 메모리 릭 예시

다음은 ThreadLocal을 사용하여 메모리 릭이 발생할 수 있는 코드 예시다:

```java
import org.junit.jupiter.api.Test;
import org.springframework.stereotype.Service;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@SpringJUnitConfig
public class MemoryLeakTest {
    private static final ThreadLocal<String> threadLocal = new ThreadLocal<>();

    @Service
    public static class MemoryLeakService {
        public void process(String value) {
            threadLocal.set(value); // ThreadLocal에 값 저장
            // 일부 처리 로직
        }

        public void clear() {
            threadLocal.remove(); // ThreadLocal에서 값 제거
        }
    }

    @Test
    public void testMemoryLeak() {
        MemoryLeakService service = new MemoryLeakService();
        ExecutorService executorService = Executors.newFixedThreadPool(10);

        for (int i = 0; i < 100; i++) {
            int finalI = i;
            executorService.submit(() -> {
                service.process("Test " + finalI);
                // 여기서 threadLocal.remove()를 호출하지 않으면 메모리 릭 발생 가능
                // service.clear(); // 이 코드를 주석 처리하여 메모리 릭 발생
            });
        }

        executorService.shutdown();
    }
}
```

위 코드에서 `service.clear()`를 호출하지 않으면, 스레드 풀의 스레드가 재사용될 때 ThreadLocal 값이 계속 메모리에 남아 메모리 릭이 발생할 수 있다. 특히 서버 환경에서 스레드 풀을 사용하는 경우 이런 문제가 더욱 심각해질 수 있다.

## 메모리 릭 해결 방법

### 1. 자원 해제 패턴 사용

리소스를 사용한 후에는 항상 해제하는 패턴을 적용한다.

```java
@Component
public class ResourceManager implements DisposableBean {
    private List<Resource> resources = new ArrayList<>();
    
    public void useResource(Resource resource) {
        resources.add(resource);
    }
    
    @Override
    public void destroy() {
        for (Resource resource : resources) {
            resource.close();
        }
        resources.clear();
    }
}
```

### 2. try-with-resources 사용

자바 7부터 도입된 try-with-resources를 사용하여 자원을 자동으로 해제한다.

```java
public void processFile(String filePath) {
    try (FileInputStream fis = new FileInputStream(filePath)) {
        // 파일 처리 로직
    } catch (IOException e) {
        // 예외 처리
    }
    // try 블록을 벗어나면 자동으로 close() 호출
}
```

### 3. 캐시에 만료 정책 적용

캐시에 크기 제한이나 만료 정책을 적용하여 메모리 사용량을 제한한다.

```java
@Service
public class ProductService {
    // Guava 캐시 사용 예시
    private LoadingCache<String, Product> cache = CacheBuilder.newBuilder()
        .maximumSize(1000) // 최대 항목 수 제한
        .expireAfterWrite(10, TimeUnit.MINUTES) // 시간 기반 만료
        .build(new CacheLoader<String, Product>() {
            @Override
            public Product load(String key) {
                return loadFromDatabase(key);
            }
        });
    
    public Product getProduct(String id) {
        try {
            return cache.get(id);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### 4. 약한 참조(WeakReference) 사용

가비지 컬렉터가 필요에 따라 회수할 수 있는 약한 참조를 사용한다.

```java
public class WeakCache {
    private Map<String, WeakReference<Object>> cache = new HashMap<>();
    
    public void put(String key, Object value) {
        cache.put(key, new WeakReference<>(value));
    }
    
    public Object get(String key) {
        WeakReference<Object> reference = cache.get(key);
        return reference != null ? reference.get() : null;
    }
}
```

### 5. ThreadLocal 사용 시 주의사항

ThreadLocal을 사용할 때는 사용이 끝난 후 반드시 remove()를 호출하여 메모리 릭을 방지한다.

```java
@Component
public class RequestContextFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) 
            throws ServletException, IOException {
        try {
            // 요청 컨텍스트 설정
            RequestContext.setUser(extractUserFromRequest(request));
            chain.doFilter(request, response);
        } finally {
            // 필터 체인 실행 후 반드시 ThreadLocal 정리
            RequestContext.clear();
        }
    }
}
```

## 메모리 릭 모니터링 및 디버깅

### 1. 메모리 프로파일링 도구 사용

- **JVisualVM**: 자바 애플리케이션의 메모리 사용량, 객체 생성 및 GC 활동을 모니터링
- **MAT (Memory Analyzer Tool)**: 힙 덤프를 분석하여 메모리 릭을 탐지
- **YourKit**: 고급 메모리 프로파일링 기능 제공

### 2. 힙 덤프 분석

애플리케이션에서 메모리 릭이 의심될 때 힙 덤프를 생성하고 분석한다.

```bash
# 실행 중인 Java 프로세스의 힙 덤프 생성
jmap -dump:format=b,file=heap_dump.hprof <pid>
```

### 3. GC 로깅 활성화

가비지 컬렉션 활동을 모니터링하여 메모리 릭의 징후를 파악한다.

```
-XX:+PrintGCDetails -XX:+PrintGCTimeStamps -Xloggc:gc.log
```

## 결론

메모리 릭은 애플리케이션의 안정성과 성능에 심각한 영향을 미칠 수 있다. 특히 장기간 실행되는 서버 애플리케이션에서는 더욱 주의가 필요하다. 제대로 된 자원 관리 패턴을 적용하고, 주기적인 모니터링을 통해 메모리 릭을 조기에 발견하고 해결하는 것이 중요하다.
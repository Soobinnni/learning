# 설정 버전 관리(Configuration Versioning)의 이해

## 1. 설정 버전 관리란?

설정 버전 관리는 애플리케이션의 설정 데이터를 시간이나 버전별로 관리하는 방법을 의미한다. 최신 설정 데이터를 항상 사용할 수 있도록 각 설정에 버전(또는 날짜)을 부여하고, 이를 기반으로 최신 설정을 조회하고 적용하는 방식이다.

## 2. 설정 버전 관리의 장점

### 2.1 빠른 롤백

설정 버전 관리를 통해 이전 버전의 설정 데이터를 보관하면, 장애가 발생했을 때 문제가 있는 최신 설정을 신속하게 이전 버전으로 롤백할 수 있다. 이는 서비스의 가동 중단 시간을 최소화하고, 문제를 빠르게 해결하는 데 큰 도움이 된다.

### 2.2 변경 이력 추적

각 설정이 버전별로 관리되기 때문에, 어떤 설정이 언제 변경되었는지 쉽게 추적할 수 있다. 이는 문제의 원인을 분석할 때 유용하며, 특정 설정 변경이 문제를 유발했는지 확인할 수 있다.

### 2.3 테스트와 배포 용이성

새로운 설정을 적용하기 전에 테스트 환경에서 해당 설정을 미리 적용해보고, 문제가 없다고 판단되면 실제 운영 환경에 적용할 수 있다. 이를 통해 설정 변경으로 인한 장애 발생 가능성을 줄일 수 있다.

### 2.4 신속한 복구

장애 발생 시 최신 설정을 빠르게 적용하거나, 문제가 된 설정을 즉시 변경할 수 있다. 또한, 설정의 버전 관리 덕분에 복구 작업이 체계적으로 이루어질 수 있다.

### 2.5 일관된 설정 관리

설정 데이터를 체계적으로 관리함으로써, 장애 발생 시에도 일관된 설정을 유지할 수 있다. 이로 인해 설정 오류로 인한 장애를 예방할 수 있다.

### 2.6 가시성 향상

설정 변경 사항이 명확하게 기록되고 관리되므로, 모든 팀원이 설정 상태를 명확히 파악할 수 있다. 이는 장애 대응을 위한 의사소통과 협업을 개선한다.

## 3. 설정 버전 관리의 단점

### 3.1 복잡성 증가

여러 버전의 설정을 관리하는 것이 복잡성을 초래할 수 있다. 특히 버전 수가 많아질수록 관리가 어려워질 수 있다.

### 3.2 저장 공간 부담

여러 버전의 설정 데이터를 저장하는 데 필요한 저장 공간이 늘어나며, 시간이 지남에 따라 상당한 용량을 차지할 수 있다.

### 3.3 인적 오류 가능성

잘못된 버전을 관리하거나 롤백할 때 실수가 발생할 수 있어 복구 과정을 복잡하게 만들 수 있다.

## 4. 구현 예시

### 4.1 설정 엔티티 생성

```java
@Entity
public class CoreSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "jsonb")
    private String configData;

    private LocalDateTime version;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Getters and Setters
}
```

### 4.2 데이터 저장 예시

```java
CoreSetting coreSetting = new CoreSetting();
coreSetting.setConfigData("{\"theme\": \"dark\", \"notifications\": \"enabled\"}");
coreSetting.setVersion(LocalDateTime.now());
coreSettingRepository.save(coreSetting);
```

### 4.3 리포지토리 예시

```java
public interface CoreSettingRepository extends JpaRepository<CoreSetting, Long> {

    @Query(value = "SELECT * FROM core_setting ORDER BY version DESC LIMIT 1", nativeQuery = true)
    Optional<CoreSetting> findLatestCoreSetting();
    
    @Query(value = "SELECT * FROM core_setting WHERE version <= :timestamp ORDER BY version DESC LIMIT 1", nativeQuery = true)
    Optional<CoreSetting> findSettingAtTime(@Param("timestamp") LocalDateTime timestamp);
    
    List<CoreSetting> findAllByOrderByVersionDesc();
}
```

### 4.4 서비스 계층 구현

```java
@Service
public class SettingService {

    private final CoreSettingRepository coreSettingRepository;
    
    @Autowired
    public SettingService(CoreSettingRepository coreSettingRepository) {
        this.coreSettingRepository = coreSettingRepository;
    }
    
    public CoreSetting getLatestSetting() {
        return coreSettingRepository.findLatestCoreSetting()
                .orElseThrow(() -> new SettingNotFoundException("No settings found"));
    }
    
    public CoreSetting getSettingAtTime(LocalDateTime timestamp) {
        return coreSettingRepository.findSettingAtTime(timestamp)
                .orElseThrow(() -> new SettingNotFoundException("No settings found for time: " + timestamp));
    }
    
    @Transactional
    public CoreSetting createNewSetting(String configData) {
        CoreSetting setting = new CoreSetting();
        setting.setConfigData(configData);
        setting.setVersion(LocalDateTime.now());
        
        return coreSettingRepository.save(setting);
    }
    
    public List<CoreSetting> getSettingHistory() {
        return coreSettingRepository.findAllByOrderByVersionDesc();
    }
    
    @Transactional
    public CoreSetting rollbackToVersion(Long settingId) {
        CoreSetting oldSetting = coreSettingRepository.findById(settingId)
                .orElseThrow(() -> new SettingNotFoundException("Setting not found with id: " + settingId));
        
        // 이전 설정을 기반으로 새 버전 생성
        return createNewSetting(oldSetting.getConfigData());
    }
}
```

### 4.5 컨트롤러 구현

```java
@RestController
@RequestMapping("/api/settings")
public class SettingController {

    private final SettingService settingService;
    
    @Autowired
    public SettingController(SettingService settingService) {
        this.settingService = settingService;
    }
    
    @GetMapping("/current")
    public ResponseEntity<CoreSetting> getCurrentSetting() {
        return ResponseEntity.ok(settingService.getLatestSetting());
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<CoreSetting>> getSettingHistory() {
        return ResponseEntity.ok(settingService.getSettingHistory());
    }
    
    @PostMapping
    public ResponseEntity<CoreSetting> createSetting(@RequestBody Map<String, Object> config) 
            throws JsonProcessingException {
        String configJson = new ObjectMapper().writeValueAsString(config);
        CoreSetting newSetting = settingService.createNewSetting(configJson);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSetting);
    }
    
    @PostMapping("/rollback/{settingId}")
    public ResponseEntity<CoreSetting> rollbackToVersion(@PathVariable Long settingId) {
        CoreSetting newSetting = settingService.rollbackToVersion(settingId);
        return ResponseEntity.ok(newSetting);
    }
}
```

## 5. 고급 구현 전략

### 5.1 설정 유효성 검증

```java
@Component
public class ConfigValidator {

    public void validateConfig(String configData) throws InvalidConfigException {
        try {
            // JSON 형식 검증
            JsonNode rootNode = new ObjectMapper().readTree(configData);
            
            // 필수 필드 검증
            if (!rootNode.has("theme")) {
                throw new InvalidConfigException("Missing required field: theme");
            }
            
            // 값 유효성 검증
            String theme = rootNode.get("theme").asText();
            if (!Arrays.asList("light", "dark", "system").contains(theme)) {
                throw new InvalidConfigException("Invalid theme value: " + theme);
            }
            
        } catch (JsonProcessingException e) {
            throw new InvalidConfigException("Invalid JSON format: " + e.getMessage());
        }
    }
}
```

### 5.2 차등 적용 전략

```java
@Service
public class GradualSettingService {

    private final CoreSettingRepository repository;
    private final Random random = new Random();
    
    public CoreSetting getSetting(String userId) {
        // 신규 설정 비율 (예: 10%)
        double newSettingRatio = 0.1;
        
        // 사용자 ID 기반 결정론적 선택 또는 무작위 선택
        boolean useNewSetting = userId.hashCode() % 100 < newSettingRatio * 100;
        
        if (useNewSetting) {
            return repository.findLatestCoreSetting().orElse(getDefaultSetting());
        } else {
            // 이전 안정 버전 사용
            return repository.findSecondLatestCoreSetting().orElse(getDefaultSetting());
        }
    }
    
    private CoreSetting getDefaultSetting() {
        CoreSetting defaultSetting = new CoreSetting();
        defaultSetting.setConfigData("{\"theme\": \"light\"}");
        return defaultSetting;
    }
}
```

### 5.3 캐싱 전략

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        List<Cache> caches = new ArrayList<>();
        caches.add(new ConcurrentMapCache("settings"));
        cacheManager.setCaches(caches);
        return cacheManager;
    }
}

@Service
public class CachedSettingService {

    private final CoreSettingRepository repository;
    
    @Cacheable(value = "settings", key = "'latest'")
    public CoreSetting getLatestSetting() {
        return repository.findLatestCoreSetting()
                .orElseThrow(() -> new SettingNotFoundException("No settings found"));
    }
    
    @CacheEvict(value = "settings", key = "'latest'")
    @Transactional
    public CoreSetting createNewSetting(String configData) {
        CoreSetting setting = new CoreSetting();
        setting.setConfigData(configData);
        setting.setVersion(LocalDateTime.now());
        
        return repository.save(setting);
    }
}
```

### 5.4 변경 감지 및 자동 적용

```java
@Component
public class SettingChangeListener {

    private final ApplicationEventPublisher eventPublisher;
    
    @Autowired
    public SettingChangeListener(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
    
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleSettingChange(SettingChangeEvent event) {
        // 설정 변경 이벤트 발행
        eventPublisher.publishEvent(new RefreshConfigEvent(event.getSource()));
    }
}

@Service
public class ConfigurationRefresher {

    @EventListener
    public void handleRefreshEvent(RefreshConfigEvent event) {
        // 애플리케이션 설정 리로드
        reloadApplicationConfig();
    }
    
    private void reloadApplicationConfig() {
        // 설정 다시 로드 로직
    }
}
```

## 6. 대규모 환경에서의 설정 버전 관리

### 6.1 분산 시스템에서의 설정 동기화

```java
@Configuration
public class DistributedConfigSyncConfig {

    @Bean
    public ConfigSynchronizer configSynchronizer(RedisTemplate<String, String> redisTemplate) {
        return new RedisConfigSynchronizer(redisTemplate);
    }
}

public class RedisConfigSynchronizer implements ConfigSynchronizer {

    private final RedisTemplate<String, String> redisTemplate;
    private final String CONFIG_CHANGE_CHANNEL = "config:changes";
    
    public RedisConfigSynchronizer(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        
        // 설정 변경 리스너 등록
        redisTemplate.getConnectionFactory().getConnection().subscribe(
            (message, pattern) -> handleConfigChange(new String(message.getBody())),
            CONFIG_CHANGE_CHANNEL.getBytes()
        );
    }
    
    public void notifyConfigChange(String configId) {
        redisTemplate.convertAndSend(CONFIG_CHANGE_CHANNEL, configId);
    }
    
    private void handleConfigChange(String configId) {
        // 설정 변경 처리 로직
    }
}
```

### 6.2 환경별 설정 분리

```java
@Entity
public class CoreSetting {
    // 기존 필드

    @Enumerated(EnumType.STRING)
    private Environment environment;
    
    // Getters and Setters
}

public enum Environment {
    DEV, TEST, STAGING, PRODUCTION
}

public interface CoreSettingRepository extends JpaRepository<CoreSetting, Long> {
    @Query(value = "SELECT * FROM core_setting WHERE environment = :env ORDER BY version DESC LIMIT 1", nativeQuery = true)
    Optional<CoreSetting> findLatestSettingForEnv(@Param("env") String environment);
}
```

## 7. 모범 사례

### 7.1 정기적인 설정 정리

오래된 설정 버전을 정리하여 저장 공간을 효율적으로 관리한다.

```java
@Component
public class SettingCleanupTask {

    private final CoreSettingRepository repository;
    
    @Scheduled(cron = "0 0 0 * * 0") // 매주 일요일 자정
    public void cleanupOldSettings() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(3);
        
        // 최근 설정 10개는 유지
        List<CoreSetting> recentSettings = repository.findTop10ByOrderByVersionDesc();
        Set<Long> protectedIds = recentSettings.stream()
                .map(CoreSetting::getId)
                .collect(Collectors.toSet());
        
        // 3개월 이상 지난 설정 중 최근 10개 제외하고 삭제
        List<CoreSetting> oldSettings = repository.findByVersionBeforeAndIdNotIn(
                cutoffDate, protectedIds);
                
        repository.deleteAll(oldSettings);
    }
}
```

### 7.2 설정 변경 알림

중요한 설정 변경 시 팀에게 알림을 보낸다.

```java
@Service
public class SettingNotificationService {

    private final EmailService emailService;
    private final SlackService slackService;
    
    @Async
    public void notifySettingChange(CoreSetting newSetting, String changedBy) {
        // 이메일 알림
        emailService.sendMail(
            "team@example.com",
            "Configuration Changed",
            String.format("Configuration was updated by %s at %s", 
                changedBy, newSetting.getVersion())
        );
        
        // Slack 알림
        slackService.sendMessage("#system-alerts", 
            String.format("Configuration changed by %s. Version: %s", 
                changedBy, newSetting.getVersion())
        );
    }
}
```

## 8. 결론

설정 버전 관리는 시스템의 안정성과 장애 대응 능력을 크게 향상시키는 중요한 기법이다. 버전별로 설정을 관리함으로써 문제 발생 시 신속한 롤백이 가능하고, 설정 변경으로 인한 장애 위험을 최소화할 수 있다.

효과적인 설정 버전 관리를 위해서는 설정 데이터의 구조화, 유효성 검증, 캐싱, 그리고 분산 환경에서의 동기화 등 다양한 측면을 고려해야 한다. 또한, 설정 변경 이력을 명확히 추적하고, 팀원들에게 변경 사항을 투명하게 공유하는 것이 중요하다.

설정 버전 관리는 시스템의 규모와 복잡성에 따라 단순한 형태부터 복잡한 형태까지 다양하게 구현할 수 있으며, 각 시스템의 요구사항과 환경에 맞게 적절히 설계하고 적용해야 한다.
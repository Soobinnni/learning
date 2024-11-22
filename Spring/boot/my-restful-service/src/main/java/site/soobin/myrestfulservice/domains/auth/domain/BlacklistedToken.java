package site.soobin.myrestfulservice.domains.auth.domain;

import java.util.concurrent.TimeUnit;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@RedisHash("blacklist")
@Getter
@NoArgsConstructor
public class BlacklistedToken {
  @Id private String token;

  @TimeToLive(unit = TimeUnit.MILLISECONDS)
  private Long expirationTime;

  @Builder
  public BlacklistedToken(String token, Long expirationTime) {
    this.token = token;
    this.expirationTime = expirationTime;
  }
}

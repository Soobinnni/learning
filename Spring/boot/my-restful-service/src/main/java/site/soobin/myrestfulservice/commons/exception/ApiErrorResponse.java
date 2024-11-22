package site.soobin.myrestfulservice.commons.exception;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class ApiErrorResponse {
  private int status;
  private String code;
  private LocalDateTime timestamp;
  private String message;
  private Map<String, String> details;
  private String path;
}

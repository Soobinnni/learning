package site.soobin.myrestfulservice.exception;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorResponse {
  private Date timestamp;
  private String errorCode;
  private String message;
  private Object details;
}

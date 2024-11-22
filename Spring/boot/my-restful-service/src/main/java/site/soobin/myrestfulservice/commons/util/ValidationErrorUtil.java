package site.soobin.myrestfulservice.commons.util;

import java.util.Map;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ValidationErrorUtil {

  public static Map<String, String> extractFieldErrors(MethodArgumentNotValidException exception) {
    return exception.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
  }
}

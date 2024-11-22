package site.soobin.myrestfulservice.domains.admin.domain;

import com.fasterxml.jackson.annotation.JsonFilter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonFilter("UserInfo")
public class Admin {
  private static final String REQUIRED_NAME_MESSAGE = "이름 입력은 필수입니다.";
  private static final String INVALID_NAME_SIZE_MESSAGE = "이름은 두 글자 이상 입력해 주세요.";
  private static final String INVALID_DATE_MESSAGE = "등록일은 과거 날짜만 입력할 수 있습니다.";

  private Integer id;

  @NotNull(message = REQUIRED_NAME_MESSAGE)
  @Size(min = 2, message = INVALID_NAME_SIZE_MESSAGE)
  private String name;

  @Past(message = INVALID_DATE_MESSAGE)
  private Date joinDate;

  private String password;
  private String ssn;
}

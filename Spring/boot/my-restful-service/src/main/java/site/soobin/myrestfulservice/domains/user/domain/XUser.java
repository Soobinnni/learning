package site.soobin.myrestfulservice.domains.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
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
@JsonIgnoreProperties(value = {"password", "ssn"})
@Schema(description = "사용자 상세 정보를 위한 도메인 객체")
public class XUser {
  private static final String REQUIRED_NAME_MESSAGE = "이름 입력은 필수입니다.";
  private static final String INVALID_NAME_SIZE_MESSAGE = "이름은 두 글자 이상 입력해 주세요.";
  private static final String INVALID_DATE_MESSAGE = "등록일은 과거 날짜만 입력할 수 있습니다.";

  @Schema(title = "사용자 ID", description = "사용자 ID는 자동 생성됩니다.")
  private Integer id;

  @Schema(title = "사용자 이름", description = "사용자 이름을 입력합니다.")
  @NotNull(message = REQUIRED_NAME_MESSAGE)
  @Size(min = 2, message = INVALID_NAME_SIZE_MESSAGE)
  private String name;

  @Schema(title = "등록일", description = "사용자의 등록일을 입력해 주세요. 입력하지 않으면 현재 날짜가 지정됩니다.")
  @Past(message = INVALID_DATE_MESSAGE)
  private Date joinDate;

  @Schema(title = "비밀번호", description = "사용자의 비밀번호를 입력해 주세요.")
  /*@JsonIgnore */ private String password;

  @Schema(title = "주민번호", description = "사용자의 주민번호를 입력해 주세요.")
  /*@JsonIgnore */ private String ssn;
}

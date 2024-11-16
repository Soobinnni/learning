package site.soobin.myrestfulservice.bean;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
  private Integer id;

  @Size(min = 2, message = "이름은 두 글자 이상 입력해 주세요.")
  private String name;

  @Past(message = "등록일은 과거 날짜만 입력할 수 있습니다.")
  private Date joinDate;
}

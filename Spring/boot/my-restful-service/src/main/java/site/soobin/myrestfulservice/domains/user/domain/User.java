package site.soobin.myrestfulservice.domains.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import site.soobin.myrestfulservice.domains.post.domain.Post;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(value = {"password", "ssn"})
@Schema(description = "사용자 상세 정보를 위한 도메인 객체")
@Entity
@Table(name = "users")
@Comment("사용자")
public class User {
  @Schema(title = "사용자 ID", description = "사용자 ID는 자동 생성됩니다.")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Schema(title = "사용자 이름", description = "사용자 이름을 입력합니다.")
  @NotNull
  private String name;

  @Schema(title = "등록일", description = "사용자의 등록일을 입력해 주세요. 입력하지 않으면 현재 날짜가 지정됩니다.")
  private Date joinDate;

  @Schema(title = "비밀번호", description = "사용자의 비밀번호를 입력해 주세요.")
  private String password;

  @Schema(title = "주민번호", description = "사용자의 주민번호를 입력해 주세요.")
  private String ssn;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
  private List<Post> posts;
}

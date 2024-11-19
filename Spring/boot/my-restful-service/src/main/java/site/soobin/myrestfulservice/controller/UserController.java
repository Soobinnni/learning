package site.soobin.myrestfulservice.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import site.soobin.myrestfulservice.bean.User;
import site.soobin.myrestfulservice.dao.UserDaoService;
import site.soobin.myrestfulservice.exception.BaseResponseException;
import site.soobin.myrestfulservice.exception.enums.UserErrorCode;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "user-controller", description = "일반 사용자 서비스를 위한 컨트롤러입니다.")
public class UserController {
  private final UserDaoService userDaoService;

  @GetMapping("")
  public List<User> retreiveAllUsers() {
    return userDaoService.findAll();
  }

  @Operation(summary = "사용자 정보 조회 API", description = "사용자 ID를 이용하여 사용자 상세 정보 조회를 합니다.")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "OK !!",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = User.class)))),
    @ApiResponse(responseCode = "400", description = "BAD REQUEST !!"),
    @ApiResponse(responseCode = "404", description = "NOT FOUND !!"),
    @ApiResponse(responseCode = "500", description = "INTERNAL SERVER ERROR !!"),
  })
  @GetMapping("/{id}")
  public EntityModel<User> retreiveUser(@PathVariable int id) {
    User findUser = userDaoService.findOne(id);
    if (findUser == null) {
      throw new BaseResponseException(UserErrorCode.USER_NOT_FOUND);
    }
    EntityModel<User> entityModel = EntityModel.of(findUser);
    WebMvcLinkBuilder linTo = linkTo(methodOn(this.getClass()).retreiveUser(id));
    entityModel.add(linTo.withRel("find-user"));
    return entityModel;
  }

  @PostMapping("")
  public ResponseEntity<User> createUser(@Valid @RequestBody User user) {

    /**
     * 201 Created 상태 코드와 함께 해당 리소스를 상세히 볼 수 있는 URI를 반환
     *
     * <p>ServletUriComponentsBuilder를 사용하여 생성된 리소스에 대한 URI를 자동으로 생성
     */
    User savedUser = userDaoService.save(user);
    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedUser.getId())
            .toUri();
    return ResponseEntity.created(location).body(savedUser);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable int id) {
    User deleteUser = userDaoService.deleteById(id);
    if (deleteUser == null) {
      throw new BaseResponseException(UserErrorCode.USER_NOT_FOUND);
    }
    return ResponseEntity.noContent().build();
  }
}

package site.soobin.myrestfulservice.controller;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
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
public class UserController {
  private UserDaoService userDaoService;

  public UserController(UserDaoService userDaoService) {
    this.userDaoService = userDaoService;
  }

  @GetMapping("")
  public List<User> retreiveAllUsers() {
    return userDaoService.findAll();
  }

  @GetMapping("/{id}")
  public User retreiveUser(@PathVariable int id) {
    User findUser = userDaoService.findOne(id);
    if (findUser == null) {
      throw new BaseResponseException(UserErrorCode.USER_NOT_FOUND);
    }
    return findUser;
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

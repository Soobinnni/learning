package site.soobin.myrestfulservice.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.soobin.myrestfulservice.bean.User;
import site.soobin.myrestfulservice.dao.UserDaoService;

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
    return userDaoService.findOne(id);
  }

  @PostMapping("")
  public void createUser(@RequestBody User user) {
    userDaoService.save(user);
  }
}

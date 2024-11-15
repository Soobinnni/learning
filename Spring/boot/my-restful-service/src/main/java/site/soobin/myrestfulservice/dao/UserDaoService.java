package site.soobin.myrestfulservice.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Component;
import site.soobin.myrestfulservice.bean.User;

@Component
public class UserDaoService {
  // database가 아닌 메모리에 임시 저장
  private static List<User> users = new ArrayList<>();

  private static int usersCount = 3;

  static {
    users.add(new User(1, "Kenneth", new Date()));
    users.add(new User(2, "Alice", new Date()));
    users.add(new User(3, "Elena", new Date()));
  }

  public List<User> findAll() {
    return users;
  }

  public User save(User user) {
    if (user.getId() == null) {
      user.setId(++usersCount);
    }

    if (user.getJoinDate() == null) {
      user.setJoinDate(new Date());
    }
    users.add(user);
    return user;
  }

  public User findOne(int id) {
    for (User user : users) {
      if (user.getId() == id) {
        return user;
      }
    }
    return null;
  }
}

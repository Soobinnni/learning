package site.soobin.myrestfulservice.domains.user.application;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import org.springframework.stereotype.Component;
import site.soobin.myrestfulservice.domains.user.domain.XUser;

@Component
public class UserDaoService {
  // database가 아닌 메모리에 임시 저장
  private static List<XUser> users = new ArrayList<>();

  private static int usersCount = 3;

  static {
    users.add(new XUser(1, "Kenneth", new Date(), "test1", "111111-111111"));
    users.add(new XUser(2, "Alice", new Date(), "test2", "222222-222222"));
    users.add(new XUser(3, "Elena", new Date(), "test3", "333333-333333"));
  }

  public List<XUser> findAll() {
    return users;
  }

  public XUser save(XUser user) {
    if (user.getId() == null) {
      user.setId(++usersCount);
    }

    if (user.getJoinDate() == null) {
      user.setJoinDate(new Date());
    }
    users.add(user);
    return user;
  }

  public XUser findOne(int id) {
    for (XUser user : users) {
      if (user.getId() == id) {
        return user;
      }
    }
    return null;
  }

  public XUser deleteById(int id) {
    Iterator<XUser> iterator = users.iterator();
    while (iterator.hasNext()) {
      XUser user = iterator.next();
      if (user.getId() == id) {
        iterator.remove();
        return user;
      }
    }
    return null;
  }
}

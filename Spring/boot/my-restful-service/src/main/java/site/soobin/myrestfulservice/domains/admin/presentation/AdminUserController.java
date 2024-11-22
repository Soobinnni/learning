package site.soobin.myrestfulservice.domains.admin.presentation;

import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.soobin.myrestfulservice.commons.exception.ApiBusinessException;
import site.soobin.myrestfulservice.domains.admin.domain.Admin;
import site.soobin.myrestfulservice.domains.admin.domain.AdminV2;
import site.soobin.myrestfulservice.domains.user.application.UserDaoService;
import site.soobin.myrestfulservice.domains.user.application.exception.UserErrorSpec;
import site.soobin.myrestfulservice.domains.user.domain.XUser;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
  private final UserDaoService userDaoService;

  //  @GetMapping("/v1/users/{id}")
  //  @GetMapping(value = "/{id}", params = "version=1")
  //  @GetMapping(value = "/{id}", headers = "X-API-VERSION=1")
  @GetMapping(value = "/{id}", produces = "application/vnd.company.appv1+json")
  public MappingJacksonValue retreiveUserForAdmin(@PathVariable int id) {
    XUser user = userDaoService.findOne(id);
    Admin admin = new Admin();
    if (user == null) {
      throw new ApiBusinessException(UserErrorSpec.USER_NOT_FOUND);
    } else {
      BeanUtils.copyProperties(user, admin); // target -> copy
    }

    SimpleBeanPropertyFilter filter =
        SimpleBeanPropertyFilter.filterOutAllExcept("id", "name", "joinDate", "ssn");
    FilterProvider filters = new SimpleFilterProvider().addFilter("UserInfo", filter);

    MappingJacksonValue mapping = new MappingJacksonValue(admin);
    mapping.setFilters(filters);

    return mapping;
  }

  //  @GetMapping("/v2/users/{id}")
  //  @GetMapping(value = "/{id}", params = "version=2")
  //  @GetMapping(value = "/{id}", headers = "X-API-VERSION=2")
  @GetMapping(value = "/{id}", produces = "application/vnd.company.appv2+json")
  public MappingJacksonValue retreiveUserForAdmin2(@PathVariable int id) {
    XUser user = userDaoService.findOne(id);
    AdminV2 admin = new AdminV2();
    if (user == null) {
      throw new ApiBusinessException(UserErrorSpec.USER_NOT_FOUND);
    } else {
      BeanUtils.copyProperties(user, admin); // target -> copy
      admin.setGrade("VIP");
    }

    SimpleBeanPropertyFilter filter =
        SimpleBeanPropertyFilter.filterOutAllExcept("id", "name", "joinDate", "grade");
    FilterProvider filters = new SimpleFilterProvider().addFilter("UserInfoV2", filter);

    MappingJacksonValue mapping = new MappingJacksonValue(admin);
    mapping.setFilters(filters);

    return mapping;
  }

  @GetMapping
  public MappingJacksonValue retreiveAllUserForAdmin() {
    List<XUser> users = userDaoService.findAll();
    List<Admin> admins = new ArrayList<>();

    Admin admin;
    for (XUser user : users) {
      admin = new Admin();
      BeanUtils.copyProperties(user, admin);

      admins.add(admin);
    }
    SimpleBeanPropertyFilter filter =
        SimpleBeanPropertyFilter.filterOutAllExcept("id", "name", "joinDate", "ssn");
    FilterProvider filters = new SimpleFilterProvider().addFilter("UserInfo", filter);

    MappingJacksonValue mapping = new MappingJacksonValue(admins);
    mapping.setFilters(filters);

    return mapping;
  }
}

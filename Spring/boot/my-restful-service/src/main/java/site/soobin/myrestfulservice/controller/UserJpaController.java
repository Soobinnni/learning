package site.soobin.myrestfulservice.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

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
import site.soobin.myrestfulservice.entity.User;
import site.soobin.myrestfulservice.exception.BaseResponseException;
import site.soobin.myrestfulservice.exception.enums.UserErrorCode;
import site.soobin.myrestfulservice.repository.UserRepository;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jpa/users")
public class UserJpaController {
  private final UserRepository repository;

  @GetMapping
  public List<User> retreiveAllUsers() {
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public EntityModel<User> retreiveUser(@PathVariable int id) {
    User findUser =
        repository
            .findById(id)
            .orElseThrow(() -> new BaseResponseException(UserErrorCode.USER_NOT_FOUND));

    EntityModel<User> entityModel = EntityModel.of(findUser);
    WebMvcLinkBuilder linTo = linkTo(methodOn(this.getClass()).retreiveUser(id));
    entityModel.add(linTo.withRel("find-user"));

    return entityModel;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable int id) {
    repository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("")
  public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
    User savedUser = repository.save(user);
    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedUser.getId())
            .toUri();
    return ResponseEntity.created(location).body(savedUser);
  }
}

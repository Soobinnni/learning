package site.soobin.myrestfulservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import site.soobin.myrestfulservice.bean.HelloWorldBean;

@RestController
public class HelloWorldController {
  @GetMapping("/hello-word")
  public String helloWord() {
    return "Hello World";
  }

  @GetMapping("/hello-word-bean")
  public HelloWorldBean helloWordBean() {
    return new HelloWorldBean("Hello World");
  }

  @GetMapping("/hello-world-bin/pass-variable/{name}")
  public String helloWorldWithPathVariable(@PathVariable String name) {
    return String.format("Hello, %s!", name);
  }
}

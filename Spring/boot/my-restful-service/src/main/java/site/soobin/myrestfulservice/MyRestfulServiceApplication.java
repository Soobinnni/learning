package site.soobin.myrestfulservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyRestfulServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyRestfulServiceApplication.class, args);

    //    ApplicationContext ac = SpringApplication.run(MyRestfulServiceApplication.class, args);

    //    // 애플리케이션 컨텍스트를 통해 현재 스프링 컨텍스트에 등록된 빈들의 목록을 확인할 수 있다.
    //    String[] allBeansNames = ac.getBeanDefinitionNames();
    //    for (String beanName : allBeansNames) {
    //      System.out.println(beanName);
    //    }
  }
}

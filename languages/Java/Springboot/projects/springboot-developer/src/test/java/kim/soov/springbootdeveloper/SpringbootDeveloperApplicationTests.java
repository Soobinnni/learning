package kim.soov.springbootdeveloper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringbootDeveloperApplicationTests {

    @DisplayName("1+2는 3이다")
    @Test
    public void junitTest(){
        int a = 1;
        int b = 2;
        int sumResult = 3;

        Assertions.assertEquals(sumResult, a+b);
    }


}

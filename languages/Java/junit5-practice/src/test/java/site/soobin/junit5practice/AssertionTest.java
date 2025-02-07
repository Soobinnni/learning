package site.soobin.junit5practice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AssertionTest {
  Calculator calculator;

  @BeforeEach
  void setUp() {
    calculator = new Calculator();
  }

  @Test
  @DisplayName("assertEquals")
  void test1() {
    Double result = calculator.operate(5, "/", 2);
    assertEquals(2.5, result);
  }

  @Test
  @Disabled // 사용 안 함
  @DisplayName("assertEquals - Supplier")
  void test1_1() {
    Double result = calculator.operate(5, "/", 0);
    // 테스트 실패 시 메시지 출력 (new Supplier<String>())
    assertEquals(2.5, result, () -> "연산자 혹은 분모가 0이 아닌지 확인해보세요!");
  }

  @Test
  @DisplayName("assertNotEquals")
  void test1_2() {
    Double result = calculator.operate(5, "/", 0);
    assertNotEquals(2.5, result);
  }

  // t or f 검사
  @Test
  @DisplayName("assertTrue 와 assertFalse")
  void test2() {
    assertTrue(calculator.validateNum(9));
    assertFalse(calculator.validateNum(0));
  }

  // null checking
  @Test
  @DisplayName("assertNotNull 과 assertNull")
  void test3() {
    Double result1 = calculator.operate(5, "/", 2);
    assertNotNull(result1);
    Double result2 = calculator.operate(5, "/", 0);
    assertNull(result2);
  }

  // 예외 예측
  @Test
  @DisplayName("assertThrows")
  void test4() {
    IllegalArgumentException exception =
        assertThrows(IllegalArgumentException.class, () -> calculator.operate(5, "?", 2));
    assertEquals("잘못된 연산자입니다.", exception.getMessage());
  }
}

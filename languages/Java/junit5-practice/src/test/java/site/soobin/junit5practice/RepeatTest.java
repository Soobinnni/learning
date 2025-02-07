package site.soobin.junit5practice;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.RepetitionInfo;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

public class RepeatTest {
  //  특정 테스트 메서드를 여러 번 반복 실행할 수 있도록 해준다.
  @RepeatedTest(value = 5, name = "반복 테스트 {currentRepetition} / {totalRepetitions}")
  void repeatTest(RepetitionInfo info) {
    System.out.println(
        "테스트 반복 : " + info.getCurrentRepetition() + " / " + info.getTotalRepetitions());
  }

  @DisplayName("파라미터 값 활용하여 테스트 하기")
  @ParameterizedTest // 해당 메서드가 파라미터화된 테스트임을 나타냄
  @ValueSource(ints = {1, 2, 3, 4, 5, 6, 7, 8, 9}) // 테스트 메서드에 전달할 입력값을 정의
  void parameterTest(int num) {
    System.out.println("5 * num = " + 5 * num);
  }
}

package io.concurrency.chapter09.exam01;

import java.util.concurrent.atomic.AtomicInteger;

public class MultiThreadCASExample {
  private static final int NUM_THREADS = 3;
  // volatile 키워드와 같이 Atomic 클래스의 get을 호출하면 무조건 메인 메모리에서 값을 읽어온다.
  private static AtomicInteger value = new AtomicInteger(0);

  public static void main(String[] args) {
    Thread[] threads = new Thread[NUM_THREADS];

    for (int i = 0; i < NUM_THREADS; i++) {
      threads[i] =
          new Thread(
              () -> {
                for (int j = 0; j < 100000; j++) {
                  int expectedValue, newValue;
                  do {
                    // 임계영역 수행 직전의 expected Value에 메인 메모리 값을 할당한다.
                    expectedValue = value.get();
                    // expected에 연산을 한 new value할당
                    newValue = expectedValue + 1;
                  } while (!value.compareAndSet(
                      // expectedValue와 현재 메모리의 값을 비교하여 true면 swap, false면 do while 진행
                      expectedValue, newValue)); // 반환 값이 false 이면 true 가 반환 될 때 까지 재시도
                  System.out.println(
                      Thread.currentThread().getName() + ":" + expectedValue + " , " + newValue);
                }
              });
      threads[i].start();
    }
    for (Thread thread : threads) {
      try {
        thread.join();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
    System.out.println("Final value: " + value.get());
  }
}

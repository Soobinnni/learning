package io.concurrency.chapter05.exam01;

public class MultiThreadExample {
  private static final Object lock = new Object();
  private static int sum = 0;

  public static void main(String[] args) {
    long start = System.currentTimeMillis();

    Thread thread1 =
        new Thread(
            () -> {
              for (int i = 1; i <= 500; i++) {
                synchronized (lock) {
                  // 동시성 문제가 일어날 수 있는 부분에 synchronized 를 통해
                  // lock을 획득하고 먼저 작업을 수행한다. sum 변수가 공유 자원이기 때문이다.
                  // 이 구문이 없다면 동시성 문제가 발생한다.
                  sum += i;
                }
                try {
                  Thread.sleep(1);
                } catch (InterruptedException e) {
                  e.printStackTrace();
                }
              }
            });

    Thread thread2 =
        new Thread(
            () -> {
              for (int i = 501; i <= 1000; i++) {
                synchronized (lock) {
                  sum += i;
                }
                try {
                  Thread.sleep(1);
                  // thread가 오류가 발생하더라도 다른 스레드에 영향을 끼치지 않으며
                  // 전체 애플리케이션의 종료로 이어지지 않는다.
                  throw new RuntimeException("error");
                } catch (InterruptedException e) {
                  e.printStackTrace();
                }
              }
            });

    thread1.start();
    thread2.start();

    try {
      thread1.join();
      thread2.join();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

    System.out.println("합계: " + sum);
    System.out.println("멀티 스레드 처리 시간: " + (System.currentTimeMillis() - start) + "ms");
  }
}

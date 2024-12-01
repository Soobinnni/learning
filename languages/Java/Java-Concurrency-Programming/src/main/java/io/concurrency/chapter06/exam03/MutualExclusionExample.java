package io.concurrency.chapter06.exam03;

// 이 예시는 자바의 모니터 기능 중 상호 배제(Mutex)를 보장하는 동기화 기법을 보여준다.
public class MutualExclusionExample {
  private int counter = 0;

  public static void main(String[] args) {
    MutualExclusionExample example = new MutualExclusionExample();

    Thread thread1 =
        new Thread(
            () -> {
              for (int i = 0; i < 5; i++) {
                example.increment();
              }
            });

    Thread thread2 =
        new Thread(
            () -> {
              for (int i = 0; i < 5; i++) {
                example.increment();
              }
            });

    thread1.start();
    thread2.start();
  }

  public synchronized void increment() {
    // 클래스의 멤버 변수를 사용하고 있다.
    // 즉 공유 자원을 연산하므로 synchronized 키워드를 통해 모니터 기능을 사용해야 한다.
    counter++;
    System.out.println("스레드: " + Thread.currentThread().getName() + ", 카운터 값: " + counter);
  }
}

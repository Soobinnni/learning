package io.concurrency.chapter07.exam01.method;

public class InstanceMethodSynchronizedExamples {

  // 하나의 인스턴스엔 임계영역 설정이 다를지라도
  // 하나의 모니터를 공유하기 때문에 synchronized 키워드가 붙은 각자의
  // 임계영역엔 하나의 스레드의 접근만이 허용된다.
  // 따라서 count의 결과는 0이 된다.

  private int count = 0;

  public static void main(String[] args) {

    InstanceMethodSynchronizedExamples counter = new InstanceMethodSynchronizedExamples();

    Thread thread1 =
        new Thread(
            () -> {
              for (int i = 0; i < 1000000; i++) {
                counter.increment();
              }
            });

    Thread thread2 =
        new Thread(
            () -> {
              for (int i = 0; i < 1000000; i++) {
                counter.decrement();
              }
            });

    thread1.start();
    thread2.start();

    try {
      thread1.join();
      thread2.join();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }

    System.out.println("최종값:" + counter.getCount());
  }

  public synchronized void increment() {
    count++;
    System.out.println(Thread.currentThread().getName() + " 가 증가시켰습니다. 현재 값:" + count);
  }

  public synchronized void decrement() {
    count--;
    System.out.println(Thread.currentThread().getName() + " 가 감소시켰습니다. 현재 값:" + count);
  }

  public int getCount() {
    return count;
  }
}

package io.concurrency.chapter07.exam01.method;

public class InstanceMethodSynchronizedExamples2 {

  private int count = 0;

  public static void main(String[] args) {

    InstanceMethodSynchronizedExamples2 counter1 = new InstanceMethodSynchronizedExamples2();
    InstanceMethodSynchronizedExamples2 counter2 = new InstanceMethodSynchronizedExamples2();

    Thread thread1 =
        new Thread(
            () -> {
              // 한 스레드가 두 개의 모니터를 획득하고 임계영역에 접근하고 있음
              // ∵ 인스턴스마다 모니터를 각자 다르게 갖고 있으므로
              // -> 같은 모니터끼리는 상호배제가 이루어진 동기화가 보장되지만,
              // 다른 모니터끼리는 상호배제의 영역이 아니므로 동시 접근이 가능하다
              for (int i = 0; i < 1000000; i++) {
                counter1.increment();
                counter2.decrement();
              }
            });

    Thread thread2 =
        new Thread(
            () -> {
              for (int i = 0; i < 1000000; i++) {
                counter2.increment();
                counter1.decrement();
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

    System.out.println("최종값:" + counter1.getCount());
    System.out.println("최종값:" + counter2.getCount());
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

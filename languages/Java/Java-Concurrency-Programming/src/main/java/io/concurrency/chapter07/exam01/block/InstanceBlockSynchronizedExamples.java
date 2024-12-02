package io.concurrency.chapter07.exam01.block;

public class InstanceBlockSynchronizedExamples {

  // 서로 다른 락을 공유하기 때문에 상호배제되지 않고 -> 경쟁상태로 인해 정확한 결과인 400000가 나오지 않는다.

  private int count = 0;

  private Object lockObject = new Object();

  public static void main(String[] args) {

    InstanceBlockSynchronizedExamples example = new InstanceBlockSynchronizedExamples();

    Thread thread1 =
        new Thread(
            () -> {
              for (int i = 0; i < 100000; i++) {
                example.incrementBlockThis();
              }
            },
            "스레드 1");

    Thread thread2 =
        new Thread(
            () -> {
              for (int i = 0; i < 100000; i++) {
                example.incrementBlockThis();
              }
            },
            "스레드 2");

    Thread thread3 =
        new Thread(
            () -> {
              for (int i = 0; i < 100000; i++) {
                example.incrementBlockLockObject();
              }
            },
            "스레드 3");

    Thread thread4 =
        new Thread(
            () -> {
              for (int i = 0; i < 100000; i++) {
                example.incrementBlockLockObject();
              }
            },
            "스레드 4");

    thread1.start();
    thread2.start();
    thread3.start();
    thread4.start();

    try {
      thread1.join();
      thread2.join();
      thread3.join();
      thread4.join();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }

    System.out.println("최종값:" + example.count);
  }

  public void incrementBlockThis() {
    //  인스턴스(this) 락
    synchronized (this) {
      count++;
      System.out.println(Thread.currentThread().getName() + " 가 This 에 의해 블록 동기화 함 : " + count);
    }
  }

  public void incrementBlockLockObject() {
    synchronized (lockObject) {
      count++;
      System.out.println(
          Thread.currentThread().getName() + " 가 LockObject 에 의해 블록 동기화 함 : " + count);
    }
  }
}

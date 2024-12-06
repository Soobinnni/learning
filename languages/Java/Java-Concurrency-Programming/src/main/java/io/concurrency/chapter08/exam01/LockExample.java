package io.concurrency.chapter08.exam01;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

// synchronized 문법은 암묵적인 락이나 Lock API는 명시적인 락으로서 락 획득과 해제를 직접 작성해야 한다.
// 대신, 객체 단위로 락 획득과 락 해제가 가능하므로 락 해제를 자유로운 위치에서 가능하다.
// 기본적으로 비공정한 락으로 생성된다.
public class LockExample {
  private int count = 0;
  private Lock lock = new ReentrantLock();

  public static void main(String[] args) {
    LockExample lockExample = new LockExample();

    Thread thread1 =
        new Thread(
            () -> {
              for (int i = 0; i < 10000; i++) {
                lockExample.increment();
              }
            });

    Thread thread2 =
        new Thread(
            () -> {
              for (int i = 0; i < 10000; i++) {
                lockExample.increment();
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

    System.out.println("Count: " + lockExample.getCount());
  }

  // 쓰기 작업
  public void increment() {
    lock.lock(); // 락을 명시적으로 활성화
    try {
      count++;
    } finally {
      lock.unlock(); // 락을 해제, finally 블록에서 작성
    }
  }

  // 읽기 작업
  public int getCount() {
    lock.lock(); // 락을 명시적으로 활성화
    try {
      return count;
    } finally {
      lock.unlock(); // 락을 해제, finally 블록에서 작성
    }
  }
}

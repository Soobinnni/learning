package io.concurrency.chapter06.exam05;

import java.util.concurrent.atomic.AtomicBoolean;

public class SpinLockVsSynchronized {
  // THREAD_COUNT수가 높다면 컨텍스트 스위칭으로 스핀락의 성능이 더 높을 수 있다.
  static final int THREAD_COUNT = 50;
  final int ITERATIONS = 10_000_000;
  private final Object syncLock = new Object();
  private AtomicBoolean spinLock = new AtomicBoolean(false);
  private int count = 0;

  public static void main(String[] args) throws InterruptedException {

    SpinLockVsSynchronized tester = new SpinLockVsSynchronized();

    // synchronized 성능 테스트
    Thread[] syncThreads = new Thread[THREAD_COUNT];
    long start2 = System.currentTimeMillis();

    for (int i = 0; i < THREAD_COUNT; i++) {
      syncThreads[i] =
          new Thread(
              () -> {
                tester.useSynchronized();
              });
      syncThreads[i].start();
    }
    for (int i = 0; i < THREAD_COUNT; i++) {
      syncThreads[i].join();
    }
    long end2 = System.currentTimeMillis();
    System.out.println("synchronized 시간: " + (end2 - start2));

    // 스핀락 성능 테스트
    Thread[] spinThreads = new Thread[THREAD_COUNT];
    long start = System.currentTimeMillis();

    for (int i = 0; i < THREAD_COUNT; i++) {
      spinThreads[i] =
          new Thread(
              () -> {
                tester.useSpinLock();
              });
      spinThreads[i].start();
    }
    for (int i = 0; i < THREAD_COUNT; i++) {
      spinThreads[i].join();
    }
    long end = System.currentTimeMillis();
    System.out.println("스핀락 시간: " + (end - start));
  }

  public void useSpinLock() {
    while (!spinLock.compareAndSet(false, true))
      ;
    for (int j = 0; j < ITERATIONS; j++) {
      count++;
    }
    spinLock.set(false);
  }

  public void useSynchronized() {
    synchronized (syncLock) {
      for (int j = 0; j < ITERATIONS; j++) {
        count++;
      }
    }
  }
}

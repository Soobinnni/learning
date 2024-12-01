package io.concurrency.chapter06.exam01;

public class SharedData {
  private int sharedValue = 0;
  private Mutex mutex;

  public SharedData(Mutex mutex) {
    this.mutex = mutex;
  }

  public void sum() {
    try {
      mutex.acquired(); // Lock 을 획득

      // 임계영역
      for (int i = 0; i < 10_000_0000; i++) {
        sharedValue++;
      }

    } finally {
      // 반드시 finally 구문에서 lock을 해제한다.
      mutex.release(); // Lock 해제
    }
  }

  public int getSum() {
    return sharedValue;
  }
}

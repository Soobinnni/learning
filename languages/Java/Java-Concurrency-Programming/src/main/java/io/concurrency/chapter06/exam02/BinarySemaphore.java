package io.concurrency.chapter06.exam02;

// 이진 세마포어는 뮤텍스의 동작 및 기능면에서 유사하다.
public class BinarySemaphore implements CommonSemaphore {
  // 이진 세마포어는 0과 1만 가지므로 권한 개수를 제한하는 정수 변수는 필요하지 않다.
  private int signal = 1;

  // 동시성 보장
  public synchronized void acquired() {
    // 0인 동안은 대기 상태에 둔다.
    // acquire는 인터럽트에 빠질 수 있다.
    while (this.signal == 0) {
      try {
        wait();
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt(); // 현재 스레드의 인터럽트 상태를 설정
      }
    }

    // while문을 통과하면 signal을 0으로 변경하여 다른 스레드의 접근을 막는다.
    this.signal = 0;
  }

  public synchronized void release() {
    // release하여 세마포어를 증가시켜 시그널을 준다.
    this.signal = 1;
    this.notify();
  }
}

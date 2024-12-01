package io.concurrency.chapter06.exam03;

public class ConditionSynchronizationExample {
  // 조건 변수가 될 것
  private boolean isAvailable = false;

  public static void main(String[] args) {
    ConditionSynchronizationExample example = new ConditionSynchronizationExample();

    Thread producer =
        new Thread(
            () -> {
              for (int i = 0; i < 5; i++) {
                example.produce();
              }
            });

    Thread consumer =
        new Thread(
            () -> {
              for (int i = 0; i < 5; i++) {
                example.consume();
              }
            });

    producer.start();
    consumer.start();
  }

  public synchronized void produce() {
    while (isAvailable) {
      try {
        // 처음엔 false이므로 생산할 것 -> 생산 뒤 true 변경. 소비 가능 상태가 됨
        // 스스로 대기 상태 (Wait Set)으로 들어감 & lock 해제
        // 누군가 소비하여 조건 변수를 false로 재할당한 뒤 notify로 깨어남
        // notify 된 스레드가 entry set에서 할당을 기다림.
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
    System.out.println("생산됨.");
    isAvailable = true;

    // 생산됨을 알림(Wait Set 꺠움)
    notify();
  }

  public synchronized void consume() {
    while (!isAvailable) {
      // 생산되지 않으면 기다림
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
    // 생산 상태일 시 소비
    System.out.println("소비됨.");

    // false로 전환
    isAvailable = false;

    // wait set의 스레드를 꺠움
    notify();
  }
}

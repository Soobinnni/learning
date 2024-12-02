package io.concurrency.chapter07.exam01;

public class SynchronizedExamples {
  private static int staticCount = 0;
  private int instanceCount = 0;

  public static synchronized void staticMethod() {
    staticCount++;
    System.out.println("정적 메서드 동기화: " + staticCount);
  }

  public static void staticBlock() {
    synchronized (SynchronizedExamples.class) {
      staticCount++;
      System.out.println("정적 블록 동기화: " + staticCount);
    }
  }

  public static void main(String[] args) {
    SynchronizedExamples example = new SynchronizedExamples();

    new Thread(example::instanceMethod).start();
    new Thread(example::instanceBlock).start();
    new Thread(SynchronizedExamples::staticMethod).start();
    new Thread(SynchronizedExamples::staticBlock).start();
  }

  public synchronized void instanceMethod() {
    instanceCount++;
    System.out.println("인스턴스 메서드 동기화: " + instanceCount);
  }

  public void instanceBlock() {
    synchronized (this) { // this ->SynchronizedExamples
      instanceCount++;
      System.out.println("인스턴스 블록 동기화: " + instanceCount);
    }
  }
}

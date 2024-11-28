package io.concurrency.chapter04.exam05;

public class ThreadLocalGetExample {
  public static void main(String[] args) {
    ThreadLocal<String> threadLocal =
        new ThreadLocal<>() {
          @Override
          protected String initialValue() {
            return "Default Value";
          }
        };

    System.out.println("First get: " + threadLocal.get()); // 생성 및 초기화
    threadLocal.set("Updated Value");
    System.out.println("Second get: " + threadLocal.get()); // 업데이트된 값 반환
  }
}

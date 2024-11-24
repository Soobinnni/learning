package io.concurrency.chapter03.exam01;

public class BasicSleepExample {
    public static void main(String[] args) {
        try {
            System.out.println("2초 후에 메시지가 출력됩니다");

            // 커널모드 전환과 컨텍스트 스위칭이 일어난다.
            Thread.sleep(2000);
            System.out.println("Hello World");

        } catch (InterruptedException e) {
            // 인터럽트를 걸 수 있기 때문에 예외 처리가 필요하다.
            throw new RuntimeException(e);
        }
    }
}

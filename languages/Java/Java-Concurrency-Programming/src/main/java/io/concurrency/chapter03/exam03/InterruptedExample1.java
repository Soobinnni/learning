package io.concurrency.chapter03.exam03;

public class InterruptedExample1 {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            while (!Thread.interrupted()) {
                System.out.println("스레드가 작동 중입니다.");
            }
            System.out.println("스레드가 인터럽트 되었습니다.");
            // 정적 메소드 interrupted는 interrupt상태를 false로 초기화 시킴
            System.out.println("인터럽트 상태: " + Thread.currentThread().isInterrupted());
        });
        thread.start();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 메인 스레드가 sleep상태의 thread를 interrupt -> 예외 발생
        thread.interrupt();
    }
}

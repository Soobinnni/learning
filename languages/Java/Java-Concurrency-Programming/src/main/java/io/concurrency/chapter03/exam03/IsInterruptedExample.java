package io.concurrency.chapter03.exam03;

public class IsInterruptedExample {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            while (!Thread.interrupted()) {
                System.out.println("스레드가 작동 중입니다.");
            }
            System.out.println("스레드가 인터럽트 되었습니다.");
            
            // 정적 메소드 interrupted의 호출로 false로 상태 초기화
            System.out.println("인터럽트 상태: " + Thread.currentThread().isInterrupted());
        });
        
        // run 실행 중
        thread.start();

        try {
            // 메인 스레드 대기 중, 그 동안 thread가 '스레드가 작동 중입니다.' 출력
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //메인스레드가 sleep thread를 interrupt
        thread.interrupt();
    }
}

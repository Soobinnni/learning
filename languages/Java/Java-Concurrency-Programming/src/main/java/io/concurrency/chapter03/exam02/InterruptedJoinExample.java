package io.concurrency.chapter03.exam02;

public class InterruptedJoinExample {

    public static void main(String[] args) {

        // 현재 실행 중인 메서드의 정보를 얻는다.
        Thread mainThread = Thread.currentThread();

        Thread longRunningThread = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    System.out.println("긴 작업 스레드가 계속 실행 중...");
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                // interruptingThread에 의해 인터럽이 걸린 longRunningThread가
                // 예외 처리로 mainThread에 interrupt를 건다.
                // main이 대기에서 runnable상태가 된다.
                // 아래 코드를 주석처리한다면 main thread는 작업을 처리하고 종료된다.
                mainThread.interrupt();
                System.out.println("긴 작업 스레드가 인터럽트 되었습니다.");
            }
        });

        longRunningThread.start();

        Thread interruptingThread = new Thread(() -> {
            try {
                System.out.println("인터럽트 스레드가 2초 후에 긴 작업 스레드를 인터럽트 합니다.");
                Thread.sleep(2000);
                longRunningThread.interrupt();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });

        interruptingThread.start();


        try {
            System.out.println("메인 스레드가 긴 작업 스레드의 완료를 기다립니다.");
            longRunningThread.join();
            System.out.println("메인 스레드 작업 완료");

        } catch (InterruptedException e) {
            System.out.println("메인 스레드가 인터럽트 되었습니다.");
            
            // 예외를 던지고 종료
            throw new RuntimeException(e);
        }
    }
}

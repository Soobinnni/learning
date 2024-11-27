package io.concurrency.chapter04.exam01;

public class ThreadExceptionExample {

    public static void main(String[] args) {

        try {
            new Thread(() -> {
                throw new RuntimeException("스레드 1 예외!");
            }).start();
        }catch(Exception e){
            sendNotificationToAdmin(e);
        }

    }

    private static void sendNotificationToAdmin(Throwable e) {
        // 호출될 수 없다->스레드 내부의 예외는 외부에서 처리할 수 없기 때문이다
        // 스레드 내부의 예외는 그대로 소멸된다.
        System.out.println("관리자에게 알림: " + e.getMessage());
    }
}

package io.concurrency.chapter04.exam01;

import java.util.logging.Level;
import java.util.logging.Logger;

public class UncaughtExceptionHandlerExample {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("스레드 시작!");

            // 예기치 않은 예외 발생
            throw new RuntimeException("예기치 않은 예외!");
        });

        // 스레드의 UncaughtExceptionHandler 설정 -> 외부에서 설정했으므로 외부 메소드 호출 가능
        thread.setUncaughtExceptionHandler((t, e) -> {
            System.out.println(t.getName() + " 에서 예외가 발생했습니다. "+ e);

            // 오류가 발생한 경우 알림 서비스 호출 (예: 이메일 또는 Slack 알림)
            sendNotificationToAdmin(e);
        });

        thread.start();
    }

    // 알림 서비스를 호출하는 메서드
    private static void sendNotificationToAdmin(Throwable e) {
        System.out.println("관리자에게 알림: " + e.getMessage());
    }
}

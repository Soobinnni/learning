package io.concurrency.chapter02.exam01;

public class AnonymousThreadClassExample {
    public static void main(String[] args) {
        // 익명 클래스로 생성
        // 재사용하지 않을 때 익명 Thread 객체 생성
        Thread thread = new Thread() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + " :스레드 실행 중..");
            }
        };

        thread.start();
    }
}

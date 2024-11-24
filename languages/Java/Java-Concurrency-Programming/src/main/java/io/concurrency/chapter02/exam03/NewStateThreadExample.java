package io.concurrency.chapter02.exam03;

public class NewStateThreadExample {

    // 스레드 생성 상태(객체 NEW) - start를 호출하지 않았기 때문에 Runnable하지 않음
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("스레드 실행 중");
        });
        System.out.println("스레드 상태: " + thread.getState()); // NEW
    }

}

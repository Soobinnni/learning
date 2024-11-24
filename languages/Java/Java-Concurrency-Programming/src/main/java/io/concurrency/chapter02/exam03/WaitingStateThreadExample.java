package io.concurrency.chapter02.exam03;

public class WaitingStateThreadExample {

    public static void main(String[] args) throws InterruptedException {
        final Object lock = new Object();
        Thread thread = new Thread(() -> {
            synchronized (lock) {
                try {
                    // wait이므로 notify가 필요
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        thread.start();
        Thread.sleep(100);
        System.out.println("스레드 상태: " + thread.getState()); // WAITING
    }
}

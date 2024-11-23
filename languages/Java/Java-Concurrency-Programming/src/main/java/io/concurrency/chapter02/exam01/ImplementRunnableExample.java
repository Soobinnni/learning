package io.concurrency.chapter02.exam01;

public class ImplementRunnableExample {
    public static void main(String[] args) {

        MyRunnable task = new MyRunnable();
        // 2. Thread 생성자에 전달하여 Thread 생성
        Thread thread = new Thread(task);
        thread.start();
    }
}

class MyRunnable implements Runnable{
    // 1. Runnable 인터페이스를 구현
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": 스레드 실행 중");
    }
}

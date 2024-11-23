package io.concurrency.chapter02.exam01;

public class ExtendThreadExample {
    public static void main(String[] args) {
        // thread를 직접 상속 받아 재정의한 경우
        MyThread myThread = new MyThread();
        myThread.start();
    }
 }

 class MyThread extends Thread{
     @Override
     public void run() {
         System.out.println(Thread.currentThread().getName() + " :스레드 실행 중.. ");
     }
 }
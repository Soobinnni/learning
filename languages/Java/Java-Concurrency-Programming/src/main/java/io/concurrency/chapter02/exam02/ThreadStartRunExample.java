package io.concurrency.chapter02.exam02;

public class ThreadStartRunExample {
    /*
    * 출력
    * main thread 종료
    * Thread-0 :스레드 실행중..
    * Thread-1 :스레드 실행중..
    * Thread-2 :스레드 실행중..
    * */
    public static void main(String[] args) {

        MyRunnable myRunnable = new MyRunnable();
        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + " :스레드 실행중..");
            }
        });
        Thread thread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + " :스레드 실행중..");
            }
        });
        Thread thread3 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + " :스레드 실행중..");
            }
        });

        thread1.start();
        thread2.start();
        thread3.start();
        // run은 직접 호출하지 않는다. 새로운 스레드와 스택이 생기지 않고 해당 메서드를 호출한 스택(메인 스레드)
        // 에 쌓이고, 실행될 뿐이다.
//        thread.run();
//        myRunnable.run();
        
        // 각 스레드는 독립적이므로 각 스레드와 관련 없이 main의 일이 끝나면 혼자 종료된다.
        System.out.println("main thread 종료");
    }

    static class MyRunnable implements Runnable{

        @Override
        public void run() {
            // 정의된 run은 jvm이 호출하므로 자동으로 호출된다.
            // 직접 호출하지 않는다.
            System.out.println(Thread.currentThread().getName() + ": 스레드 실행 중...");
        }
    }
}

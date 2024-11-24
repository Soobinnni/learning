package io.concurrency.chapter02.exam02;

public class ThreadStartRunExample {
    public static void main(String[] args) {

        MyRunnable myRunnable = new MyRunnable();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + " :스레드 실행중..");
            }
        });

        thread.start();
        // run은 직접 호출하지 않는다. 새로운 스레드와 스택이 생기지 않고 해당 메서드를 호출한 스택(메인 스레드)
        // 에 쌓이고, 실행될 뿐이다.
//        thread.run();
//        myRunnable.run();

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

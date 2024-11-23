package io.concurrency.chapter01.exam01;

import java.util.ArrayList;
import java.util.List;

public class ParallelismExample {
    public static void main(String[] args) {
//        int cpuCores = 1;
        // 내 컴퓨터의 코어 개수
        int cpuCores = Runtime.getRuntime().availableProcessors();
        System.out.println(String.format("cpuCores: %d개", cpuCores));

        // CPU 개수만큼 데이터를 생성(16개)
        List<Integer> data = new ArrayList<>();
        for (int i = 0; i < cpuCores; i++) {
            data.add(i);
        }

        // CPU 개수만큼 데이터를 병렬로 처리
        long startTime1 = System.currentTimeMillis();
        long sum1 = data.parallelStream()
                .mapToLong(i -> {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    return i * i;
                })
                .sum();
        // 원래 순차적으로 처리하면 6초가 걸릴 것
        // -> 데이터를 각각 쪼개서 하나의 데이터를 하나의 Thread가 맡아
        // 그 작업을 동시적으로 독립적으로 처리할 수 있도록 한다(parallelStream).
        // -> 약 0.5초가 걸릴 것

        long endTime1 = System.currentTimeMillis();

        // result: 514ms
        System.out.println("CPU 개수만큼 데이터를 병렬로 처리하는 데 걸린 시간: " + (endTime1 - startTime1) + "ms");
        System.out.println("결과1: " + sum1);

        // CPU 개수만큼 데이터를 순차적 처리
        long startTime2 = System.currentTimeMillis();
        long sum2 = data.stream()
                .mapToLong(i -> {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    return i * i;
                })
                .sum();
        // 원래 순차적으로 처리하면 8초가 걸릴 것
        // -> 데이터를 각각 쪼개서 하나의 데이터를 하나의 Thread가 맡아
        // 그 작업을 동시적으로 독립적으로 처리할 수 있도록 한다(parallelStream).
        // -> 약 0.5초가 걸릴 것

        long endTime2 = System.currentTimeMillis();

        // result: 8182ms
        System.out.println("CPU 개수만큼 데이터를 순차적 처리하는 데 걸린 시간: " + (endTime2 - startTime2) + "ms");
        System.out.println("결과1: " + sum2);
    }
}

package io.concurrency.chapter05.exam04;

public class ImmutableExample implements Runnable {
  private ImmutablePerson person;

  public ImmutableExample(ImmutablePerson person) {
    this.person = person;
  }

  public static void main(String[] args) {
    // 필드 자체가 변경될 모든 요소를 원천 차단
    ImmutablePerson person = new ImmutablePerson("홍길동", 25);

    for (int i = 0; i < 10; i++) {
      new Thread(new ImmutableExample(person)).start();
    }
  }

  @Override
  public void run() {
    System.out.println(
        Thread.currentThread().getName()
            + " - 이름: "
            + person.getName()
            + ", 나이: "
            + person.getAge());
  }
}

final class ImmutablePerson {
  // 변경 불가능한 클래스로 만들어 동시성 문제를 없앤다. -> final키워드, setter 없음
  private final String name;
  private final int age;

  public ImmutablePerson(String name, int age) {
    this.name = name;
    this.age = age;
  }

  public String getName() {
    return name;
  }

  public int getAge() {
    return age;
  }
}

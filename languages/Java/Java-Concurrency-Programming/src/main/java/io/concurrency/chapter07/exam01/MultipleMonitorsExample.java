package io.concurrency.chapter07.exam01;

class BankAccount {
  private final Object lock = new Object();
  private double balance;

  public BankAccount(double initialBalance) {
    this.balance = initialBalance;
  }

  public void deposit(double amount) {
    synchronized (lock) {
      balance += amount;
    }
  }

  public boolean withdraw(double amount) {
    synchronized (lock) {
      if (balance < amount) {
        return false;
      }
      balance -= amount;
      return true;
    }
  }

  public boolean transfer(BankAccount to, double amount) {
    synchronized (this.lock) {
      if (this.withdraw(amount)) {
        synchronized (to.lock) {
          // to의 lock이므로 this의 lock과는 다르다

          // 만약 transfer를 호출한 대상이 A 스레드라면, 해당 메서드에서
          // A lock과 B(to)의 lock을 A 스레드가 획득한 상태이므로
          // A가 transfer 작업을 모두 마치기 전까지 A, B 락을 획득하지 못한다.
          to.deposit(amount);
          return true;
        }
      }
      return false;
    }
  }

  public double getBalance() {
    synchronized (lock) {
      return balance;
    }
  }
}

public class MultipleMonitorsExample {

  public static void main(String[] args) {
    BankAccount accountA = new BankAccount(1000);
    BankAccount accountB = new BankAccount(1000);

    // accountA에서 accountB로 송금하는 스레드
    Thread t1 =
        new Thread(
            () -> {
              for (int i = 0; i < 10; i++) {
                boolean result = accountA.transfer(accountB, 10);
                if (result) {
                  System.out.println("accountA에서 accountB로 10 송금 성공");
                } else {
                  System.out.println("accountA에서 accountB로 10 송금 실패");
                }
              }
            });

    // accountB에서 accountA로 송금하는 스레드
    Thread t2 =
        new Thread(
            () -> {
              for (int i = 0; i < 10; i++) {
                boolean result = accountB.transfer(accountA, 10);
                if (result) {
                  System.out.println("accountB에서 accountA로 10 송금 성공");
                } else {
                  System.out.println("accountB에서 accountA로 10 송금 실패");
                }
              }
            });

    t1.start();
    t2.start();

    try {
      t1.join();
      t2.join();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

    System.out.println("accountA의 최종 잔액: " + accountA.getBalance());
    System.out.println("accountB의 최종 잔액: " + accountB.getBalance());
  }
}

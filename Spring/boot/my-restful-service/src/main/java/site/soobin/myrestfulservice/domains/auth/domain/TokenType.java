package site.soobin.myrestfulservice.domains.auth.domain;

public enum TokenType {
  ACCESS,
  REFRESH;

  public int getExpiryDays() {
    return switch (this) {
      case ACCESS -> 1; // 1일
      case REFRESH -> 30; // 30일
    };
  }
}

package kr.co.shortenurlservice.domain;

import lombok.Getter;

@Getter
public class NotFoundShortenUrlException extends RuntimeException {
  private final String shortenUrl;

  public NotFoundShortenUrlException(String shortenUrl, Throwable throwable) {
    super(throwable.getMessage());
    this.shortenUrl = shortenUrl;
  }

  public NotFoundShortenUrlException(String shortenUrl) {
    super("단축 키를 찾지 못했습니다.");
    this.shortenUrl = shortenUrl;
  }
}

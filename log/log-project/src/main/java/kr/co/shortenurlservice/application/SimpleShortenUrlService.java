package kr.co.shortenurlservice.application;

import java.util.List;
import kr.co.shortenurlservice.domain.LackOfShortenUrlKeyException;
import kr.co.shortenurlservice.domain.NotFoundShortenUrlException;
import kr.co.shortenurlservice.domain.ShortenUrl;
import kr.co.shortenurlservice.domain.ShortenUrlRepository;
import kr.co.shortenurlservice.presentation.ShortenUrlCreateRequestDto;
import kr.co.shortenurlservice.presentation.ShortenUrlCreateResponseDto;
import kr.co.shortenurlservice.presentation.ShortenUrlInformationDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SimpleShortenUrlService {

  private ShortenUrlRepository shortenUrlRepository;

  @Autowired
  SimpleShortenUrlService(ShortenUrlRepository shortenUrlRepository) {
    this.shortenUrlRepository = shortenUrlRepository;
  }

  public ShortenUrlCreateResponseDto generateShortenUrl(
      ShortenUrlCreateRequestDto shortenUrlCreateRequestDto) {
    String originalUrl = shortenUrlCreateRequestDto.getOriginalUrl();
    String shortenUrlKey = getUniqueShortenUrlKey();
    log.debug("getUniqueShortenUrlKey: {}", shortenUrlKey);

    ShortenUrl shortenUrl = new ShortenUrl(originalUrl, shortenUrlKey);
    shortenUrlRepository.saveShortenUrl(shortenUrl);
    log.info("shortenUrl 생성: {}", shortenUrl);

    ShortenUrlCreateResponseDto shortenUrlCreateResponseDto =
        new ShortenUrlCreateResponseDto(shortenUrl);
    return shortenUrlCreateResponseDto;
  }

  public String getOriginalUrlByShortenUrlKey(String shortenUrlKey) {
    ShortenUrl shortenUrl = shortenUrlRepository.findShortenUrlByShortenUrlKey(shortenUrlKey);

    if (null == shortenUrl) throw new NotFoundShortenUrlException(shortenUrlKey);

    shortenUrl.increaseRedirectCount();
    shortenUrlRepository.saveShortenUrl(shortenUrl);

    String originalUrl = shortenUrl.getOriginalUrl();

    return originalUrl;
  }

  public ShortenUrlInformationDto getShortenUrlInformationByShortenUrlKey(String shortenUrlKey) {
    ShortenUrl shortenUrl = shortenUrlRepository.findShortenUrlByShortenUrlKey(shortenUrlKey);

    if (null == shortenUrl) throw new NotFoundShortenUrlException(shortenUrlKey);

    ShortenUrlInformationDto shortenUrlInformationDto = new ShortenUrlInformationDto(shortenUrl);

    return shortenUrlInformationDto;
  }

  public List<ShortenUrlInformationDto> getAllShortenUrlInformationDto() {
    List<ShortenUrl> shortenUrls = shortenUrlRepository.findAll();

    return shortenUrls.stream()
        .map(shortenUrl -> new ShortenUrlInformationDto(shortenUrl))
        .toList();
  }

  private String getUniqueShortenUrlKey() {
    final int MAX_RETRY_COUNT = 5;
    int count = 0;

    while (count++ < MAX_RETRY_COUNT) {
      String shortenUrlKey = ShortenUrl.generateShortenUrlKey();
      ShortenUrl shortenUrl = shortenUrlRepository.findShortenUrlByShortenUrlKey(shortenUrlKey);

      if (null == shortenUrl) return shortenUrlKey;

      // 재시도를 하게 되는 곳
      log.warn("단축 URL 생성 재시도! 재시도 횟수 : {}", count + 1);
    }
    throw new LackOfShortenUrlKeyException();
  }
}

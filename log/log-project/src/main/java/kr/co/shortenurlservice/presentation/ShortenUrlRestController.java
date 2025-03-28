package kr.co.shortenurlservice.presentation;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import kr.co.shortenurlservice.application.SimpleShortenUrlService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
public class ShortenUrlRestController {

  private SimpleShortenUrlService simpleShortenUrlService;

  @Autowired
  ShortenUrlRestController(SimpleShortenUrlService simpleShortenUrlService) {
    this.simpleShortenUrlService = simpleShortenUrlService;
  }

  @PostMapping(value = "/shortenUrl")
  public ResponseEntity<ShortenUrlCreateResponseDto> createShortenUrl(
      @Valid @RequestBody ShortenUrlCreateRequestDto shortenUrlCreateRequestDto) {
    log.trace("createShortenUrl: {}", shortenUrlCreateRequestDto);
    ShortenUrlCreateResponseDto shortenUrlCreateResponseDto =
        simpleShortenUrlService.generateShortenUrl(shortenUrlCreateRequestDto);
    return ResponseEntity.ok(shortenUrlCreateResponseDto);
  }

  @GetMapping(value = "/{shortenUrlKey}")
  public ResponseEntity<?> redirectShortenUrl(@PathVariable String shortenUrlKey)
      throws URISyntaxException {
    String originalUrl = simpleShortenUrlService.getOriginalUrlByShortenUrlKey(shortenUrlKey);

    URI redirectUri = new URI(originalUrl);
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setLocation(redirectUri);

    return new ResponseEntity<>(httpHeaders, HttpStatus.MOVED_PERMANENTLY);
  }

  @GetMapping(value = "/shortenUrl/{shortenUrlKey}")
  public ResponseEntity<ShortenUrlInformationDto> getShortenUrlInformation(
      @PathVariable String shortenUrlKey) {
    ShortenUrlInformationDto shortenUrlInformationDto =
        simpleShortenUrlService.getShortenUrlInformationByShortenUrlKey(shortenUrlKey);
    return ResponseEntity.ok(shortenUrlInformationDto);
  }

  @GetMapping(value = "/shortenUrls")
  public ResponseEntity<List<ShortenUrlInformationDto>> getAllShortenUrlInformation() {
    List<ShortenUrlInformationDto> shortenUrlInformationDtoList =
        simpleShortenUrlService.getAllShortenUrlInformationDto();

    return ResponseEntity.ok(shortenUrlInformationDtoList);
  }
}

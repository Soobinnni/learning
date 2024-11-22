package site.soobin.myrestfulservice.domains.auth.application.dto;

public record TokenRequest(String accessToken, String refreshToken) {}

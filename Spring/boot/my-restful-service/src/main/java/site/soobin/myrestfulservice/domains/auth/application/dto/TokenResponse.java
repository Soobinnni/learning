package site.soobin.myrestfulservice.domains.auth.application.dto;

import lombok.Builder;
import site.soobin.myrestfulservice.domains.auth.domain.JwtClaims;

@Builder
public record TokenResponse(String accessToken, String refreshToken, JwtClaims claims) {}

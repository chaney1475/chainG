package com.ssafy.chaing.auth.service;

import com.ssafy.chaing.auth.jwt.AuthClaims;
import com.ssafy.chaing.auth.jwt.JwtService;
import com.ssafy.chaing.auth.service.command.SignupCommand;
import com.ssafy.chaing.auth.service.dto.AuthDTO;
import com.ssafy.chaing.auth.service.dto.UserInfoDTO;
import com.ssafy.chaing.user.domain.RoleType;
import com.ssafy.chaing.user.domain.UserEntity;
import com.ssafy.chaing.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthDTO signup(SignupCommand command, HttpServletResponse response) {
        userRepository.findByEmailAddress(command.getEmailAddress()).ifPresent(user -> {
            throw new RuntimeException("이미 존재하는 유저입니다.");
        });

        // 새로운 사용자 생성
        UserEntity user = UserEntity.builder()
                .emailAddress(command.getEmailAddress())
                .password(passwordEncoder.encode(command.getPassword()))
                .nickname(command.getNickname())
                .name(command.getName())
                .roleType(RoleType.USER)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(new AuthClaims(user.getId()));
        String refreshToken = jwtService.generateRefreshToken(new AuthClaims(user.getId()));

        jwtService.setRefreshTokenCookie(response, refreshToken);

        return new AuthDTO(accessToken, new UserInfoDTO(user.getId(), user.getName(), user.getNickname()));
    }

    @Override
    public AuthDTO login(String emailAddress, String password, HttpServletResponse response) {
        UserEntity user = userRepository.findByEmailAddress(emailAddress)
                .orElseThrow(() -> new RuntimeException("Not Found User"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("잘못된 비밀번호입니다.");
        }

        String accessToken = jwtService.generateAccessToken(new AuthClaims(user.getId()));
        String refreshToken = jwtService.generateRefreshToken(new AuthClaims(user.getId()));

        jwtService.setRefreshTokenCookie(response, refreshToken);

        return new AuthDTO(accessToken, new UserInfoDTO(user.getId(), user.getName(), user.getNickname()));
    }

    @Override
    public AuthDTO reissueTokens(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = jwtService.getRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            throw new RuntimeException("다시 로그인해주세요.");
        }

        AuthClaims claims = jwtService.extractClaims(refreshToken);

        UserEntity user = userRepository.findById(claims.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. 다시 로그인해주세요."));

        String accessToken = jwtService.generateAccessToken(new AuthClaims(user.getId()));
        String newRefreshToken = jwtService.generateRefreshToken(new AuthClaims(user.getId()));

        jwtService.setRefreshTokenCookie(response, newRefreshToken);

        return new AuthDTO(accessToken, new UserInfoDTO(user.getId(), user.getName(), user.getNickname()));
    }
}

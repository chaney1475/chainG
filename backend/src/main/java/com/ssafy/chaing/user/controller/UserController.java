package com.ssafy.chaing.user.controller;


import com.ssafy.chaing.user.service.UserService;
import com.ssafy.chaing.user.service.dto.UserDTO;
import com.sun.security.auth.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "User Controller",
        description = "사용자 정보 관리"
)
@RequestMapping("/api/v1/users")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "나의 요약 프로필 조회",
            description = "나의 요약 프로필을 조회합니다."
    )
    @GetMapping("/me/summary")
    public ResponseEntity<UserDTO> getMySummary(@AuthenticationPrincipal UserPrincipal principal) {
        // 나의 프로필 정보 조회
        UserDTO dto = userService.getMe(Long.valueOf(principal.getName()));

        return ResponseEntity.ok().body(dto);
    }

}

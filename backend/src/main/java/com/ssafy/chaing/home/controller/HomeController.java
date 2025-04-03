package com.ssafy.chaing.home.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.home.controller.response.HomeOverviewResponse;
import com.ssafy.chaing.home.service.HomeFacade;
import com.ssafy.chaing.home.service.command.HomeOverviewCommand;
import com.ssafy.chaing.home.service.dto.HomeOverviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RequestMapping("/api/v1/home")
@RestController
public class HomeController {

    private final HomeFacade homeFacade;

    @GetMapping
    public ResponseEntity<BaseResponse<HomeOverviewResponse>> getHomeOverview(
            @AuthenticationPrincipal UserPrincipal principal
    ) {

        System.out.println("principal.getId() = " + principal.getId());
        HomeOverviewDTO dto = homeFacade.getHomeOverview(new HomeOverviewCommand(principal.getId()));
        HomeOverviewResponse response = HomeOverviewResponse.from(dto);

        return ResponseEntity.ok()
                .body(BaseResponse.success(response));
    }
}

package com.ssafy.chaing.rule.controller;


import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.rule.controller.request.LifeRuleApproveRequest;
import com.ssafy.chaing.rule.controller.request.LifeRuleFormRequest;
import com.ssafy.chaing.rule.controller.request.LifeRuleUpdateRequest;
import com.ssafy.chaing.rule.controller.request.RecommendCategoryRequest;
import com.ssafy.chaing.rule.controller.response.LifeRuleResponse;
import com.ssafy.chaing.rule.controller.response.RecommendCategoryResponse;
import com.ssafy.chaing.rule.dto.LifeRuleUpdateDto;
import com.ssafy.chaing.rule.service.RuleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(
        name = "Rule Controller",
        description = "생활 룰 관리"
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/life-rule")
public class RuleController {

    private final RuleService ruleService;

    // 생활룰 전체 페이지 생성
    @PostMapping
    public ResponseEntity<BaseResponse<LifeRuleResponse>> createLifeRule(@RequestBody LifeRuleFormRequest body,
                                                                         @AuthenticationPrincipal UserPrincipal principal) {

        LifeRuleResponse lifeRule = ruleService.createLifeRule(body, principal.getId());
        return ResponseEntity.ok(BaseResponse.success(lifeRule));
    }

    // 생활룰 전체 페이지 조회
    @GetMapping
    public ResponseEntity<BaseResponse<LifeRuleResponse>> getLifeRule(@RequestBody LifeRuleFormRequest body,
                                                                      @AuthenticationPrincipal UserPrincipal principal) {
        LifeRuleResponse lifeRules = ruleService.getLifeRules(principal.getId());
        return ResponseEntity.ok(BaseResponse.success(lifeRules));
    }

    // 생활룰 수정
    @PostMapping("/update-temp")
    public ResponseEntity<BaseResponse<List<LifeRuleUpdateDto>>> updateLifeRule(@RequestBody LifeRuleUpdateRequest body,
                                                                                @AuthenticationPrincipal UserPrincipal principal) {
        List<LifeRuleUpdateDto> lifeRuleUpdates = ruleService.updateRules(body, principal.getId());
        return ResponseEntity.ok(BaseResponse.success(lifeRuleUpdates));
    }

    //생활룰 수정 사항 조회
    @GetMapping("/update-temp")
    public ResponseEntity<BaseResponse<List<LifeRuleUpdateDto>>> getUpdateLifeRule(
            @RequestBody LifeRuleFormRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<LifeRuleUpdateDto> updateLifeRule = ruleService.getUpdateLifeRule(principal.getId());
        return ResponseEntity.ok(BaseResponse.success(updateLifeRule));
    }

    // 생활 룰 수정 승인/거부
    @PostMapping("/approved")
    public ResponseEntity<BaseResponse<Void>> approveUpdateForm(@RequestBody LifeRuleApproveRequest body,
                                                                @AuthenticationPrincipal UserPrincipal principal) {
        ruleService.approveLifeRule(body, principal.getId());
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    // TODO : GPT 카테고리 추천 API 추가.
    @PostMapping("/category")
    public ResponseEntity<BaseResponse<RecommendCategoryResponse>> recommendCategory(
            @RequestBody RecommendCategoryRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {

        return ResponseEntity.ok(BaseResponse.success(null));
    }


}

package com.ssafy.chaing.duty.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.duty.controller.request.DutyFormRequest;
import com.ssafy.chaing.duty.controller.response.DutyDetailResponse;
import com.ssafy.chaing.duty.controller.response.DutyListResponse;
import com.ssafy.chaing.duty.controller.response.RemovedDutyResponse;
import com.ssafy.chaing.duty.service.DutyService;
import com.ssafy.chaing.recommend.Request.RecommendRequest;
import com.ssafy.chaing.recommend.response.RecommendResponse;
import com.ssafy.chaing.recommend.service.RecommendService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Duty Controller",
        description = "당번 관리"
)
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/duty")
public class DutyController {

    private final DutyService dutyService;
    private final RecommendService recommendService;

    @GetMapping("/{groupId}")
    public ResponseEntity<BaseResponse<DutyListResponse>> getDuties(@PathVariable("groupId") Long groupId) {
        DutyListResponse duties = dutyService.getDuties(groupId);
        return ResponseEntity.ok(BaseResponse.success(duties));
    }

    // 생성, 수정, 삭제 로직에선 Command 사용하지 않음.
    @PostMapping("/{groupId}")
    public ResponseEntity<BaseResponse<DutyDetailResponse>> createDuty(
            @PathVariable("groupId") Long groupId,
            @RequestBody DutyFormRequest body) {
        DutyDetailResponse dutyDetailResponse = dutyService.creatDuty(groupId, body);
        return ResponseEntity.ok(BaseResponse.success(dutyDetailResponse));

    }

    @PatchMapping("/{dutyId}")
    public ResponseEntity<BaseResponse<DutyDetailResponse>> modifyDuty(
            @PathVariable("dutyId") Long dutyId,
            @RequestBody DutyFormRequest body) {

        DutyDetailResponse dutyDetailResponse = dutyService.updateDuty(dutyId, body);
        return ResponseEntity.ok(BaseResponse.success(dutyDetailResponse));
    }

    @DeleteMapping("/{dutyId}")
    public ResponseEntity<BaseResponse<RemovedDutyResponse>> deleteDuty(
            @PathVariable("dutyId") Long dutyId,
            @AuthenticationPrincipal UserPrincipal principal) {
        RemovedDutyResponse removedDutyResponse = dutyService.removeDuty(dutyId);
        return ResponseEntity.ok(BaseResponse.success(removedDutyResponse));
    }

    @PostMapping("/category")
    public ResponseEntity<BaseResponse<RecommendResponse>> deleteDuty(
            @RequestBody RecommendRequest body) {
        RecommendResponse response = recommendService.recommendDutyCategory(body);
        return ResponseEntity.ok(BaseResponse.success(response));
    }
}

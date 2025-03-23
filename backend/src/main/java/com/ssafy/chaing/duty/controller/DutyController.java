package com.ssafy.chaing.duty.controller;

import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.duty.controller.request.DutyFormRequest;
import com.ssafy.chaing.duty.controller.response.DutyDetailResponse;
import com.ssafy.chaing.duty.controller.response.DutyListResponse;
import com.ssafy.chaing.duty.controller.response.RemovedDutyResponse;
import com.ssafy.chaing.duty.service.DutyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
@Tag(
        name = "Duty Controller",
        description = "당번 관리"
)
@RequiredArgsConstructor
@RestController("/api/v1/duty")
public class DutyController {

    private final DutyService dutyService;

    @GetMapping("/{groupId}")
    public ResponseEntity<BaseResponse<DutyListResponse>> getDuties(@PathVariable Long groupId){
        return ResponseEntity.ok(BaseResponse.success(null));

    }

    // 생성, 수정, 삭제 로직에선 Command 사용하지 않음.
    @PostMapping("/{groupId}")
    public ResponseEntity<BaseResponse<DutyDetailResponse>> createDuty(@PathVariable Long groupId , @RequestBody DutyFormRequest body ){
        return ResponseEntity.ok(BaseResponse.success(null));

    }

    @PatchMapping("/{dutyId}")
    public ResponseEntity<BaseResponse<DutyDetailResponse>> modifyDuty(@PathVariable Long dutyId, @RequestBody DutyFormRequest body){
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @DeleteMapping("/{dutyId}")
    public ResponseEntity<BaseResponse<RemovedDutyResponse>> deleteDuty(@PathVariable Long dutyId) {

        return ResponseEntity.ok(BaseResponse.success(null));
    }
}

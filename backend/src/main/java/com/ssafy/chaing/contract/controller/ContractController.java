package com.ssafy.chaing.contract.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.contract.controller.request.ApproveContractRequest;
import com.ssafy.chaing.contract.controller.request.ConfirmContractRequest;
import com.ssafy.chaing.contract.controller.request.EmptyContractRequest;
import com.ssafy.chaing.contract.controller.request.UpdateDraftContractRequest;
import com.ssafy.chaing.contract.controller.response.ContractDetailResponse;
import com.ssafy.chaing.contract.controller.response.ContractMemberResponse;
import com.ssafy.chaing.contract.controller.response.DraftContractResponse;
import com.ssafy.chaing.contract.service.ContractService;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.contract.service.dto.ContractDetailDTO;
import com.ssafy.chaing.contract.service.dto.ContractUserDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Group Controller",
        description = "계약 정보 관리"
)
@Controller
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/contract")
public class ContractController {

    private final ContractService contractService;

    @GetMapping("/{contractId}")
    public ResponseEntity<BaseResponse<ContractDetailResponse>> getContract(@PathVariable Long contractId) {
        ContractDetailDTO contract = contractService.getContract(contractId);
        ContractDetailResponse response = ContractDetailResponse.fromDTO(contract);
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<DraftContractResponse>> createEmptyContract(
            @RequestBody EmptyContractRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ContractDTO contractDTO = contractService.createDraftContract(body.groupId(), principal.getId());
        DraftContractResponse response = DraftContractResponse.from(contractDTO);
        return ResponseEntity.created(URI.create("/contract/" + contractDTO.getId()))
                .body(BaseResponse.success(response));

    }

    @PutMapping("/{contractId}")
    public ResponseEntity<BaseResponse<ContractDetailResponse>> updateContract(
            @PathVariable Long contractId,
            @RequestBody UpdateDraftContractRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ContractDetailDTO contractDTO = contractService.updateContract(
                contractId,
                body.toCommand(principal.getId())
        );

        return ResponseEntity.ok(
                BaseResponse.success(
                        ContractDetailResponse.fromDTO(contractDTO)
                )
        );
    }

    @PutMapping("/{contractId}/pending")
    public ResponseEntity<BaseResponse<ContractDetailResponse>> confirmContract(
            @PathVariable Long contractId,
            @RequestBody ConfirmContractRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        // 계약을 확정하는 서비스 메서드 호출
        ContractDetailDTO contractDTO = contractService.confirmContract(
                contractId,
                body.toCommand(principal.getId())
        );

        return ResponseEntity.ok(
                BaseResponse.success(
                        ContractDetailResponse.fromDTO(contractDTO)
                )
        );
    }

    @PostMapping("/{contractId}/approve")
    public ResponseEntity<BaseResponse<Void>> approveContract(
            @PathVariable Long contractId,
            @RequestBody ApproveContractRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        contractService.approveContract(
                contractId,
                body.toCommand(principal.getId())
        );

        // 응답으로 변환
        return ResponseEntity.ok(
                BaseResponse.success(
                        null
                )
        );
    }

    @GetMapping("/{contractId}/members")
    public ResponseEntity<BaseResponse<List<ContractMemberResponse>>> getContractMembers(
            @PathVariable Long contractId
    ) {
        List<ContractUserDTO> dto = contractService.getContractMembers(contractId);
        List<ContractMemberResponse> response = dto.stream()
                .map(ContractMemberResponse::from).toList();

        return ResponseEntity.ok(
                BaseResponse.success(response)
        );
    }


}

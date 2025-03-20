package com.ssafy.chaing.contract.controller;

import com.ssafy.chaing.auth.domain.UserPrincipal;
import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.contract.controller.request.EmptyContractRequest;
import com.ssafy.chaing.contract.controller.request.UpdateDraftContractRequest;
import com.ssafy.chaing.contract.controller.response.DraftContractResponse;
import com.ssafy.chaing.contract.service.ContractService;
import com.ssafy.chaing.contract.service.dto.ContractDTO;
import com.ssafy.chaing.contract.service.dto.ContractDetailDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
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
    public ResponseEntity<BaseResponse<ContractDetailDTO>> getContract(@PathVariable Long contractId) {
        ContractDetailDTO contract = contractService.getContract(contractId);
        return ResponseEntity.ok(BaseResponse.success(contract));
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
    public ResponseEntity<BaseResponse<DraftContractResponse>> updateContract(
            @PathVariable Long contractId,
            @RequestBody UpdateDraftContractRequest body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ContractDTO contractDTO = contractService.updateContract(
                contractId,
                body.toCommand(principal.getId())
        );

        return ResponseEntity.ok(
                BaseResponse.success(
                        DraftContractResponse.from(contractDTO)
                )
        );
    }
//
//    @PutMapping("/finalize")
//    public ResponseEntity<String> finalizeContract(
//            @PathVariable Long id,
//            @RequestBody @Valid ContractFinalizeRequest request
//    ) {
//        contractService.finalizeContract(id, request);
//        return ResponseEntity.ok("Contract finalized");
//    }

}

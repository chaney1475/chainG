package com.ssafy.chaing.fintech.controller;

import com.ssafy.chaing.common.schema.BaseResponse;
import com.ssafy.chaing.fintech.controller.request.TransferCommand;
import com.ssafy.chaing.fintech.controller.response.FintechResponse;
import com.ssafy.chaing.fintech.service.FintechService;
import com.ssafy.chaing.fintech.service.dto.TransferDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Fintech API", description = "핀테크 송금 API")
@RequiredArgsConstructor
@RequestMapping("/api/v1/fintech")
@RestController
public class FintechController {

    private final FintechService fintechService;

    @Operation(
            summary = "생활비 송금",
            description = "공동생활비 또는 정산을 위한 송금 요청을 처리합니다."
    )
    @PostMapping("/transfer")
    public ResponseEntity<BaseResponse<TransferDTO>> transfer(
            @RequestBody TransferCommand body
    ) {
        TransferDTO dto = fintechService.transfer(body);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(dto));
    }

    @GetMapping("/account/{accountNo}")
    public ResponseEntity<?> getAccountDetail(
            @PathVariable String accountNo
    ) {
        FintechResponse<?> response = fintechService.inquireDemandDepositAccount(accountNo);
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @PostMapping("/account")
    public ResponseEntity<?> createAccount() {
        FintechResponse<?> response = fintechService.createAccount();
        return ResponseEntity.ok(BaseResponse.success(response));
    }
}
